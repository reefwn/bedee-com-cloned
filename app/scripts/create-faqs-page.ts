import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

// The live old site's /faqs page (https://www.bedee.com/faqs) has no actual
// Q&A content — checked via rendered DOM, only the page title exists. The
// only real FAQ content anywhere in this CMS is the 3-item FAQ block already
// on /telepharmacy. Reusing it here rather than inventing new questions.
const telepharmacy = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'telepharmacy' } },
  limit: 1,
  locale: 'th',
  overrideAccess: true,
  depth: 0,
})
const faqBlock = (telepharmacy.docs[0]?.layout as Array<{ blockType: string; items?: unknown[] }> | undefined)?.find(
  (b) => b.blockType === 'faq',
)
if (!faqBlock) throw new Error('telepharmacy has no faq block to source content from')

// Strip ids so Payload generates fresh ones instead of colliding with the
// source block's existing array-item rows.
const items = (faqBlock.items as Array<{ question: string; answer: string }>).map(
  ({ question, answer }) => ({ question, answer }),
)

const data = {
  title: 'คำถามที่พบบ่อย',
  slug: 'faqs',
  sourceUrl: 'https://www.bedee.com/faqs',
  layout: [
    {
      blockType: 'faq' as const,
      heading: 'คำถามที่พบบ่อย',
      items,
    },
  ],
  seo: {
    metaTitle: 'คำถามที่พบบ่อย - BeDee',
    metaDescription: 'คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการของ BeDee',
  },
  _status: 'published' as const,
}

const existing = (
  await payload.find({ collection: 'pages', where: { slug: { equals: 'faqs' } }, limit: 1, overrideAccess: true })
).docs[0]

if (existing) {
  await payload.update({ collection: 'pages', id: existing.id, data, locale: 'th', overrideAccess: true })
  console.log('updated existing faqs page', existing.id)
} else {
  const created = await payload.create({ collection: 'pages', data, locale: 'th', overrideAccess: true })
  console.log('created faqs page', created.id)
}

const footer = await payload.findGlobal({ slug: 'footer', locale: 'th', overrideAccess: true, depth: 0 })
const linkGroups = (footer.linkGroups ?? []) as Array<{ links: Array<{ url: string; label: string; id?: string }> }>
const newGroups = linkGroups.map((group) => ({
  ...group,
  links: group.links.map((link) =>
    link.url === 'https://www.bedee.com/faqs' ? { ...link, url: '/faqs' } : link,
  ),
}))
await payload.updateGlobal({ slug: 'footer', data: { linkGroups: newGroups }, locale: 'th', overrideAccess: true })
console.log('updated footer FAQ link to /faqs')

await Promise.race([payload.destroy(), new Promise((resolve) => setTimeout(resolve, 2_000))])
process.exit(0)
