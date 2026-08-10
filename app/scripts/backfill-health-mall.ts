import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

async function uploadImage(path: string, alt: string, filename: string, mimetype: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
    overrideAccess: true,
  })
}

const bgHm = await uploadImage('/tmp/hm-assets/bg-hm.jpg', 'BeDee Health Mall', 'hm-bg.jpg', 'image/jpeg')
const collage = await uploadImage(
  '/tmp/hm-assets/page-hm-collage.png',
  'ช้อปสินค้าสุขภาพที่ BeDee Health Mall',
  'hm-collage.png',
  'image/png',
)
const iconDefs = [
  { file: 'icon-home-remedies.png', label: 'ยาสามัญประจำบ้าน' },
  { file: 'icon-personal-care.png', label: 'ผลิตภัณฑ์ดูแลส่วนบุคคล' },
  { file: 'icon-vitamins.png', label: 'วิตามินและอาหารเสริม' },
  { file: 'icon-medical-supplies.png', label: 'สินค้าเวชภัณฑ์' },
  { file: 'icon-skincare.png', label: 'ผลิตภัณฑ์บำรุงผิว' },
  { file: 'icon-medical-equipment.png', label: 'ชุดอุปกรณ์และเครื่องมือแพทย์' },
]
const icons: Record<string, { id: number }> = {}
for (const def of iconDefs) {
  const media = await uploadImage(`/tmp/hm-assets/${def.file}`, def.label, def.file, 'image/png')
  icons[def.label] = { id: media.id as number }
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const children = layout[0].content.root.children as any[]

// Reuse exact existing nodes verbatim (no retyped copy) for the surviving
// unique text — only the literal duplicate repetition (source itself
// duplicates the "Health Mall" + category-icon section twice) and the two
// dead-end headings (no icons/links) are being fixed.
const healthMallHeading = children[9]
const healthMallIntro = children[10]
const whatsInsideHeading = children[11]
const deliveryHeading = children[20]
const deliveryParagraph = children[21]
const productsHeading = children[28]

// Give the dead "สินค้าสุขภาพ" heading a real destination — shop.bedee.com is
// the verified real e-commerce entry point (same one linked from the site's
// own "ช้อปแพ็กสุขภาพ" nav item), reusing its exact existing text as the link
// label rather than inventing new CTA copy.
const productsLinkNode = {
  ...productsHeading,
  children: [
    {
      type: 'link',
      version: 3,
      fields: { url: 'https://shop.bedee.com/th', newTab: true, linkType: 'custom' },
      format: '',
      indent: 0,
      direction: 'ltr' as const,
      children: productsHeading.children,
    },
  ],
}

const richText1 = layout[0]
const makeRichText = (nodes: any[]) => ({
  blockType: 'richTextContent' as const,
  heading: null,
  content: { ...richText1.content, root: { ...richText1.content.root, children: nodes } },
})
const richTextIntro = makeRichText([healthMallHeading, healthMallIntro, whatsInsideHeading])
const richTextDelivery = makeRichText([deliveryHeading, deliveryParagraph, productsLinkNode])

const heroCarousel = {
  blockType: 'heroCarousel' as const,
  variant: 'coral' as const,
  backgroundImage: bgHm.id,
  slides: [
    {
      headline: children[0].children.map((c: any) => c.text).join(''),
      body: children[1].children.map((c: any) => c.text).join(''),
      image: collage.id,
    },
  ],
}

const promotionGrid = {
  blockType: 'promotionGrid' as const,
  heading: children[2].children.map((c: any) => c.text).join(''),
  promotions: [3, 8, 9], // free-shipping, teleconsult-freedelivery, telepharmacy-delivery
}

const iconGrid = {
  blockType: 'iconGrid' as const,
  heading: null,
  items: iconDefs.map((def) => ({ icon: icons[def.label].id, label: def.label })),
}

const articleGrid = {
  blockType: 'articleGrid' as const,
  heading: children[29].children.map((c: any) => c.text).join(''),
  postCount: 3,
}

const newLayout = [heroCarousel, promotionGrid, richTextIntro, iconGrid, richTextDelivery, articleGrid]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
