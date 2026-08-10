import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

// "unicharm-3d-fit-mask-size-m-4-pcs-2" is a dead link on bedee.com itself
// (404) whose image/alt ("KleanKare Nasal Connect") doesn't even match its
// own href — a genuinely broken/orphaned carousel slide on the source site,
// not a real product. The correct product (same mask, live URL, real bulk
// price) already exists as its own separate entry. Remove the bad one
// rather than propagate source's own error into our data or AI-SEO schema.
const BAD_PRODUCT_URL = 'https://www.bedee.com/unicharm-3d-fit-mask-size-m-4-pcs-2'

const bad = (
  await payload.find({ collection: 'products', where: { externalUrl: { equals: BAD_PRODUCT_URL } }, limit: 1 })
).docs[0]
if (!bad) throw new Error('bad product not found — already removed?')
console.log('removing product', bad.id, bad.title)

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const carouselIndex = layout.findIndex((b) => b.blockType === 'productCarousel')
const carousel = layout[carouselIndex]
const newProductIds = (carousel.products as any[])
  .map((p: any) => (typeof p === 'object' ? p.id : p))
  .filter((id: number) => id !== bad.id)

const newLayout = [...layout]
newLayout[carouselIndex] = { ...carousel, products: newProductIds }

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
await payload.delete({ collection: 'products', id: bad.id, overrideAccess: true })
console.log('done, remaining products in carousel:', newProductIds.length)
process.exit(0)
