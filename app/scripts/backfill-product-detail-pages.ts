import { createHash } from 'node:crypto'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

function slugFromUrl(url: string): string {
  const parts = new URL(url).pathname.split('/').filter(Boolean)
  return decodeURIComponent(parts.at(-1) ?? '')
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

type Section = { heading: string; items: string[] }

function parseDetailSections(html: string): Section[] {
  const widgetMatch = html.match(
    /รายละเอียดสินค้า[\s\S]*?elementor-widget-text-editor"[^>]*>\s*([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  )
  const scope = widgetMatch?.[1]
  if (!scope) return []

  const sections: Section[] = []
  // A heading's content can be a <ul> of features, an <ol> of numbered steps,
  // or plain <p> prose (medical-device products use step instructions +
  // paragraphs instead of a simple bullet list) — handle all three shapes.
  const headingRe = /<h2><strong>([^<]+)<\/strong><\/h2>([\s\S]*?)(?=<h2><strong>|$)/g
  let m: RegExpExecArray | null
  while ((m = headingRe.exec(scope))) {
    const heading = stripTags(m[1])
    const chunk = m[2]
    let items: string[]
    const listMatch = chunk.match(/<(ul|ol)>([\s\S]*?)<\/\1>/)
    if (listMatch) {
      const items0 = [...listMatch[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
        .map((li) => stripTags(li[1]))
        .filter(Boolean)
      items = listMatch[1] === 'ol' ? items0.map((text, i) => `${i + 1}. ${text}`) : items0
    } else {
      items = [...chunk.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => stripTags(p[1])).filter(Boolean)
    }
    if (heading && items.length) sections.push({ heading, items })
  }
  return sections
}

function bucketSection(heading: string): 'highlights' | 'keyIngredients' | 'usage' | 'warnings' | null {
  if (/สมบัติ/.test(heading)) return 'highlights'
  if (/ส่วนประกอบ|ประกอบด้วย/.test(heading)) return 'keyIngredients'
  if (/รับประทาน|วิธีใช้|ขนาดใช้|วิธีการใช้งาน|คำแนะนำ/.test(heading)) return 'usage'
  if (/เตือน|ข้อห้าม|ข้อควรระวัง/.test(heading)) return 'warnings'
  return null
}

function parseDescription(html: string): { shortDescription?: string; description?: string } {
  // The text-editor widget sitting right after the price "mark" span and
  // before the first CTA button — same structural position across products.
  const m = html.match(
    /<span class="mark">[\s\S]*?<\/div>\s*<div[^>]*elementor-widget-text-editor[^>]*>([\s\S]*?)<\/div>\s*<div/,
  )
  const scope = m?.[1]
  if (!scope) return {}
  const paragraphs = [...scope.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => stripTags(p[1])).filter(Boolean)
  if (!paragraphs.length) return {}
  return { shortDescription: paragraphs[0], description: paragraphs.slice(1).join(' ') || undefined }
}

function parseGalleryImages(html: string): string[] {
  // Scope to the top-of-page image carousel only — a site-wide scan of
  // data-lazy-src also picks up footer/nav icons unrelated to this product.
  const carouselMatch = html.match(
    /elementor-image-carousel swiper-wrapper[^>]*>([\s\S]*?)<div class="elementor-swiper-button/,
  )
  const scope = carouselMatch?.[1] ?? ''
  const urls = new Set<string>()
  for (const m of scope.matchAll(/class="swiper-slide-image"[^>]*\s(?:src|data-lazy-src)="([^"]+)"/g)) {
    if (m[1].startsWith('http')) urls.add(m[1])
  }
  // A slide can have BOTH a placeholder src and a real data-lazy-src — re-scan
  // within the same scope for data-lazy-src so the real URL always wins.
  for (const m of scope.matchAll(/data-lazy-src="([^"]+)"/g)) {
    if (m[1].startsWith('http')) urls.add(m[1])
  }
  return [...urls]
}

async function downloadImage(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'BeDee-Payload-POC/1.0' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  const data = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
  const originalName = path.basename(decodeURIComponent(new URL(url).pathname)) || 'image.jpg'
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 10)
  const name = `pdp-${hash}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  return { data, mimetype: contentType, name, size: data.length }
}

async function uploadGalleryImage(url: string, alt: string) {
  const filenameGuess = `pdp-${createHash('sha256').update(url).digest('hex').slice(0, 10)}-${path
    .basename(decodeURIComponent(new URL(url).pathname))
    .replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const existing = (
    await payload.find({ collection: 'media', where: { filename: { equals: filenameGuess } }, limit: 1 })
  ).docs[0]
  if (existing) return existing
  const file = await downloadImage(url)
  return payload.create({ collection: 'media', data: { alt }, file, overrideAccess: true })
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 }))
  .docs[0]
const layout = page.layout as any[]
const carousel = layout.find((b) => b.blockType === 'productCarousel')
const productIds: number[] = carousel.products.map((p: any) => (typeof p === 'object' ? p.id : p))

const force = process.argv.includes('--force')
const results: Record<string, string> = {}
const unmatchedHeadings = new Set<string>()

for (const id of productIds) {
  const product = await payload.findByID({ collection: 'products', id, depth: 0 })
  const label = `#${id} ${product.title}`

  if (product.slug && !force) {
    results[label] = 'already has slug, skipped'
    continue
  }

  let html: string
  try {
    const res = await fetch(product.externalUrl, {
      headers: { 'user-agent': 'Mozilla/5.0', accept: 'text/html' },
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } catch (err) {
    results[label] = `FETCH FAILED: ${err instanceof Error ? err.message : String(err)}`
    continue
  }

  const slug = slugFromUrl(product.externalUrl)
  const { shortDescription, description } = parseDescription(html)
  const sections = parseDetailSections(html)
  const bulletFields: Record<string, string[]> = { highlights: [], keyIngredients: [], usage: [], warnings: [] }
  for (const section of sections) {
    const bucket = bucketSection(section.heading)
    if (bucket) bulletFields[bucket].push(...section.items)
    else unmatchedHeadings.add(`${label}: "${section.heading}"`)
  }

  const galleryUrls = parseGalleryImages(html).slice(0, 4)
  const galleryMedia = []
  for (const url of galleryUrls) {
    try {
      galleryMedia.push(await uploadGalleryImage(url, product.title))
    } catch (err) {
      results[label] = (results[label] ?? '') + ` [gallery image failed: ${url}]`
    }
  }

  await payload.update({
    collection: 'products',
    id,
    data: {
      slug,
      shortDescription,
      description,
      gallery: galleryMedia.map((m) => ({ image: m.id })),
      highlights: bulletFields.highlights.map((text) => ({ text })),
      keyIngredients: bulletFields.keyIngredients.map((text) => ({ text })),
      usage: bulletFields.usage.map((text) => ({ text })),
      warnings: bulletFields.warnings.map((text) => ({ text })),
    },
    overrideAccess: true,
  })

  results[label] =
    (results[label] ?? 'ok') +
    ` — sections:${sections.length} gallery:${galleryMedia.length} desc:${Boolean(shortDescription)}`
  console.log(label, results[label])
}

console.log('\n--- summary ---')
for (const [label, result] of Object.entries(results)) console.log(label, '=>', result)
if (unmatchedHeadings.size) {
  console.log('\n--- unmatched section headings (not bucketed, needs manual review) ---')
  for (const h of unmatchedHeadings) console.log(h)
}

process.exit(0)
