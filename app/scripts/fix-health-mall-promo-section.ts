import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const iconGridBlock = layout.find((b) => b.blockType === 'iconGrid')
const richTextIntro = layout.find(
  (b) => b.blockType === 'richTextContent' && JSON.stringify(b.content).includes('ช้อปอะไรได้บ้างใน Health Mall'),
)
const richTextDelivery = layout.find(
  (b) => b.blockType === 'richTextContent' && JSON.stringify(b.content).includes('จัดส่งสินค้าสุขภาพถึงบ้านคุณ'),
)

const introChildren = richTextIntro.content.root.children as any[]
const healthMallHeadingText = introChildren
  .find((c: any) => c.type === 'heading')
  .children.map((c: any) => c.text)
  .join('')
const introText = introChildren
  .find((c: any) => c.type === 'paragraph')
  .children.map((c: any) => c.text)
  .join('')
const whatsInsideText = introChildren
  .filter((c: any) => c.type === 'heading')[1]
  .children.map((c: any) => c.text)
  .join('')

// group-33285-1-768x821-1.png (delivery guy + baked-in "ส่งด่วน 90 นาที" /
// "สินค้า 2,500+ ชิ้น" badges) is already uploaded to Media — the homepage's
// own promoBanner block (layout[5]) uses the same real asset, id 31.
const promoBanner = {
  blockType: 'promoBanner' as const,
  heading: healthMallHeadingText,
  body: introText,
  image: 31,
  subheading: whatsInsideText,
  iconItems: iconGridBlock.items.map((item: any) => ({
    icon: typeof item.icon === 'object' ? item.icon.id : item.icon,
    label: item.label,
  })),
}

// richTextDelivery was [deliveryHeading, deliveryParagraph, productsLinkNode]
// (see backfill-health-mall.ts) — the heading+paragraph's facts (2,500+ ชิ้น
// / ส่งด่วน 90 นาที) don't appear anywhere in this photo's own text column on
// the real page (bedee.com/health-mall screenshot); they're already the
// photo's own baked-in badges, so only the trailing real link survives,
// carried into its own small block.
const deliveryChildren = richTextDelivery.content.root.children as any[]
const productsLinkNode = deliveryChildren[deliveryChildren.length - 1]
const richTextProducts = {
  blockType: 'richTextContent' as const,
  heading: null,
  content: { ...richTextDelivery.content, root: { ...richTextDelivery.content.root, children: [productsLinkNode] } },
}

const heroCarousel = layout.find((b) => b.blockType === 'heroCarousel')
const promotionGrid = layout.find((b) => b.blockType === 'promotionGrid')
const articleGrid = layout.find((b) => b.blockType === 'articleGrid')

const newLayout = [heroCarousel, promotionGrid, promoBanner, richTextProducts, articleGrid]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
