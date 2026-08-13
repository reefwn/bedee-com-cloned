import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

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

function parseSections(html: string): Section[] {
  const widgetMatch = html.match(
    /รายละเอียดสินค้า[\s\S]*?elementor-widget-text-editor"[^>]*>\s*([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  )
  const scope = widgetMatch?.[1]
  if (!scope) return []

  const sections: Section[] = []
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

function parseFaqs(sections: Section[]): { question: string; answer: string }[] {
  const faqSection = sections.find((s) => /คำถามที่พบบ่อย/.test(s.heading))
  if (!faqSection) return []

  const faqs: { question: string; answer: string }[] = []
  let current: { question: string; answer: string } | null = null
  for (const text of faqSection.items) {
    if (/^Q\s*\d*\s*[:.]/i.test(text)) {
      if (current) faqs.push(current)
      current = { question: text.replace(/^Q\s*\d*\s*[:.]\s*/i, '').trim(), answer: '' }
    } else if (current) {
      const cleaned = text.replace(/^BeDee\s*[:.]\s*/i, '').trim()
      current.answer = current.answer ? `${current.answer} ${cleaned}` : cleaned
    }
  }
  if (current) faqs.push(current)
  return faqs.filter((f) => f.question && f.answer)
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 }))
  .docs[0]
const layout = page.layout as any[]
const carousel = layout.find((b) => b.blockType === 'productCarousel')
const productIds: number[] = carousel.products.map((p: any) => (typeof p === 'object' ? p.id : p))

let withFaqs = 0
for (const id of productIds) {
  const product = await payload.findByID({ collection: 'products', id, depth: 0 })
  const res = await fetch(product.externalUrl, { headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) {
    console.log(`#${id} ${product.title} — fetch failed HTTP ${res.status}`)
    continue
  }
  const html = await res.text()
  const faqs = parseFaqs(parseSections(html))

  if (!faqs.length) {
    console.log(`#${id} ${product.title} — no FAQ`)
    continue
  }

  await payload.update({ collection: 'products', id, data: { faqs }, overrideAccess: true })
  withFaqs++
  console.log(`#${id} ${product.title} — ${faqs.length} FAQs`)
}

console.log(`\ndone — ${withFaqs}/${productIds.length} products got FAQs`)
process.exit(0)
