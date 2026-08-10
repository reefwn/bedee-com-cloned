import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

type RawProduct = {
  url: string
  price: string | null
  name: string | null
  image: string | null
  localFile: string
}

async function uploadImage(path: string, alt: string, filename: string, mimetype: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
    overrideAccess: true,
  })
}

const raw = JSON.parse(readFileSync('/tmp/hm-products.json', 'utf-8')) as RawProduct[]

const icon = await uploadImage('/tmp/hm-assets/icon-bag.png', 'สินค้าสุขภาพ', 'hm-products-icon.png', 'image/png')

const productIds: number[] = []
for (const [i, p] of raw.entries()) {
  const ext = p.localFile.split('.').pop() as string
  const mime = ext === 'png' ? 'image/png' : ext === 'jpeg' ? 'image/jpeg' : 'image/jpeg'
  const media = await uploadImage(p.localFile, p.name ?? '', `hm-product-${i}.${ext}`, mime)
  const price = p.price ? Number(p.price.replace(/[฿,]/g, '')) : null
  const doc = await payload.create({
    collection: 'products',
    data: { title: p.name ?? p.url, image: media.id, price, externalUrl: p.url },
    overrideAccess: true,
  })
  productIds.push(doc.id as number)
  console.log(i + 1, '/', raw.length, p.name)
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-mall' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const richTextProductsIndex = layout.findIndex(
  (b) => b.blockType === 'richTextContent' && JSON.stringify(b.content).includes('สินค้าสุขภาพ'),
)
if (richTextProductsIndex === -1) throw new Error('could not find the สินค้าสุขภาพ link block')

const productCarousel = {
  blockType: 'productCarousel' as const,
  heading: 'สินค้าสุขภาพ',
  icon: icon.id,
  products: productIds,
}

const newLayout = [...layout]
newLayout[richTextProductsIndex] = productCarousel

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
