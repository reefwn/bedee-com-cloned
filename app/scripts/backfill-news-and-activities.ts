import { createHash } from 'node:crypto'
import path from 'node:path'
import { Window } from 'happy-dom'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const LIST_URL = 'https://www.bedee.com/news-and-activities'
const TOTAL_PAGES = 7

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim()
}

type ListItem = { url: string; title: string; excerpt: string; image: string; publishedAt: string }

function parseListPage(html: string): ListItem[] {
  const items: ListItem[] = []
  for (const articleMatch of html.matchAll(/<article id="article-\d+" class="article-post">([\s\S]*?)<\/article>/g)) {
    const block = articleMatch[1]
    const url = block.match(/<a href="([^"]+)" title="/)?.[1]
    const title = stripTags(block.match(/<div class="head-h3 vc-title">\s*<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? '')
    const excerpt = stripTags(block.match(/<div class="p_excerpt">\s*<p>([\s\S]*?)<\/p>/)?.[1] ?? '')
    // Only the first couple of images per page are eager-loaded (plain
    // `src`); the rest are lazy (`data-lazy-src`) — check both.
    const imgTag = block.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*>/)?.[0] ?? ''
    const image =
      imgTag.match(/data-lazy-src="(https:\/\/www\.bedee\.com\/wp-content\/uploads\/[^"]+)"/)?.[1] ??
      imgTag.match(/\ssrc="(https:\/\/www\.bedee\.com\/wp-content\/uploads\/[^"]+)"/)?.[1]
    const dateMatch = block.match(/post_date">[\s\S]*?<\/span>\s*(\d{2}\/\d{2}\/\d{4})/)
    if (!url || !title || !image || !dateMatch) continue
    const [day, month, year] = dateMatch[1].split('/')
    items.push({ url, title, excerpt, image, publishedAt: `${year}-${month}-${day}` })
  }
  return items
}

type ContentChunk = { tag: string; text: string }

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
}

function textNode(text: string) {
  return { detail: 0, format: 0, mode: 'normal' as const, style: '', text, type: 'text' as const, version: 1 as const }
}

function chunksToLexical(chunks: ContentChunk[]) {
  return {
    root: {
      children: chunks.map(({ tag, text }) => {
        const isHeading = /^h[2-4]$/.test(tag)
        const common = {
          children: [textNode(tag === 'li' ? `• ${text}` : text)],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1 as const,
        }
        if (isHeading) return { ...common, tag: tag as 'h2' | 'h3' | 'h4', type: 'heading' as const }
        return { ...common, textFormat: 0, textStyle: '', type: 'paragraph' as const }
      }),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root' as const,
      version: 1 as const,
    },
  }
}

function extractChunks(document: InstanceType<typeof Window>['document']): ContentChunk[] {
  const root = document.querySelector('.single-content .content .elementor') ?? document.querySelector('main')
  if (!root) return []
  root
    .querySelectorAll(
      'script, style, noscript, nav, form, footer, [class*="related"], [class*="cookie"], [class*="breadcrumb"], [class*="share"], [class*="social"]',
    )
    .forEach((node) => node.remove())

  const chunks: ContentChunk[] = []
  let previous = ''
  root.querySelectorAll('h2, h3, h4, p, li, blockquote').forEach((node) => {
    const text = normalizeText(node.textContent)
    if (text.length < 2 || text === previous) return
    previous = text
    chunks.push({ tag: node.tagName.toLowerCase(), text })
  })
  return chunks.slice(0, 160)
}

async function uploadImage(url: string, alt: string) {
  const filename = `news-${createHash('sha256').update(url).digest('hex').slice(0, 10)}-${path
    .basename(decodeURIComponent(new URL(url).pathname))
    .replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const existing = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 }))
    .docs[0]
  if (existing) return existing

  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  const data = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/png'
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: contentType, name: filename, size: data.length },
    overrideAccess: true,
  })
}

function slugFromUrl(url: string): string {
  const parts = new URL(url).pathname.split('/').filter(Boolean)
  return decodeURIComponent(parts.at(-1) ?? '')
}

// Collect all 42 real items across the source's 7 listing pages first.
const allItems: ListItem[] = []
for (let i = 1; i <= TOTAL_PAGES; i++) {
  const url = i === 1 ? LIST_URL : `${LIST_URL}/page/${i}`
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(30_000) })
  const html = await res.text()
  const items = parseListPage(html)
  console.log(`page ${i}: ${items.length} items`)
  allItems.push(...items)
}
// The feed occasionally cross-posts a Promotion item (its real URL is
// /promotion/..., not /news-and-activities/...) — that content belongs to
// the Promotions collection, not here.
const newsItems = allItems.filter((item) => new URL(item.url).pathname.startsWith('/news-and-activities/'))
console.log(`total: ${allItems.length} items, ${newsItems.length} are real news items (rest cross-posted elsewhere)\n`)

let created = 0
let skipped = 0
let failed = 0

for (const item of newsItems) {
  const slug = slugFromUrl(item.url)
  const existing = (
    await payload.find({ collection: 'news-and-activities', where: { slug: { equals: slug } }, limit: 1 })
  ).docs[0]
  if (existing) {
    skipped++
    console.log(`skip (exists): ${item.title}`)
    continue
  }

  try {
    const detailRes = await fetch(item.url, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(30_000) })
    if (!detailRes.ok) throw new Error(`detail page HTTP ${detailRes.status}`)
    const detailHtml = await detailRes.text()

    const window = new Window({ url: item.url })
    window.document.write(detailHtml)
    const chunks = extractChunks(window.document)

    const media = await uploadImage(item.image, item.title)

    await payload.create({
      collection: 'news-and-activities',
      data: {
        title: item.title,
        slug,
        featuredImage: media.id,
        excerpt: item.excerpt || undefined,
        content: chunksToLexical(chunks),
        publishedAt: item.publishedAt,
        _status: 'published',
      },
      locale: 'th',
      overrideAccess: true,
    })
    created++
    console.log(`created: ${item.title} (${chunks.length} chunks)`)
  } catch (err) {
    failed++
    console.error(`FAILED: ${item.title} — ${err instanceof Error ? err.message : String(err)}`)
  }
}

console.log(`\ndone — created:${created} skipped:${skipped} failed:${failed} total:${newsItems.length}`)
process.exit(0)
