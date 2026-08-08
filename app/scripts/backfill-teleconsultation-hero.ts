import { getPayload } from 'payload'
import config from '../src/payload.config'

// The teleconsultation page was missing its actual top-of-page hero banner
// entirely — confirmed live on bedee.com/teleconsultation: a light-blue
// gradient hero with the H1, a short subheadline, and a "ดาวน์โหลดแอป"
// (Download app) CTA, next to the same doctor/pharmacy-delivery collage
// photo already used elsewhere in this project. The subheadline text was
// already present (scraped into the first paragraph of richText1's flat
// content), just never given hero treatment — removed the duplicate line
// now that it lives in the hero block instead.
//
// Reuses HeroCarousel with a new "light" variant (pale gradient, dark text,
// coral CTA) added specifically for this — the existing homepage hero stays
// on its "dark" default, unaffected. Reuses the same collage image already
// uploaded for this page (id 298, tc-steps-app-screenshot.png) rather than
// duplicating the asset. CTA links to the real onelink.me hero-banner
// campaign URL read directly off the source's own button.

const payload = await getPayload({ config })

const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'teleconsultation' } },
  limit: 1,
})
const page = result.docs[0]
if (!page) throw new Error('page not found')

const existingLayout = page.layout as any[]
const richText1 = existingLayout[0].content
const firstNode = richText1.root.children[0]
if (firstNode?.type !== 'paragraph') throw new Error('expected first richText1 node to be the subheadline paragraph')
const trimmedRichText1 = {
  ...richText1,
  root: { ...richText1.root, children: richText1.root.children.slice(1) },
}

const heroBlock = {
  blockType: 'heroCarousel',
  variant: 'light',
  slides: [
    {
      headline: 'ปรึกษาหมอออนไลน์\nหาหมอสะดวก ได้ทุกที่ ทุกเวลา',
      body: 'พร้อมรับยาที่บ้าน ป่วยเมื่อไหร่เปิดแอปปรึกษาหมอ BeDee',
      image: 298,
      ctaLabel: 'ดาวน์โหลดแอป',
      ctaUrl: 'https://bedee.onelink.me/iQMa/?hero-banner',
    },
  ],
}

const newLayout = [...existingLayout]
newLayout[0] = { ...existingLayout[0], content: trimmedRichText1 }
newLayout.unshift(heroBlock)

await payload.update({
  collection: 'pages',
  id: page.id,
  data: { layout: newLayout },
  overrideAccess: true,
})

console.log('Inserted light-variant hero banner on page', page.id)
process.exit(0)
