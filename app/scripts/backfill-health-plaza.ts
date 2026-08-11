import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

async function uploadImage(path: string, alt: string, filename: string, mimetype: string) {
  const existing = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })).docs[0]
  if (existing) return existing
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
    overrideAccess: true,
  })
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'health-plaza' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const richText = layout[0]
const children = richText.content.root.children as any[]
const textOf = (node: any) => (node.children ?? []).map((c: any) => c.text).join('')

// ---- Intro ----
const makeRichText = (nodes: any[]) => ({
  blockType: 'richTextContent' as const,
  heading: null,
  content: { ...richText.content, root: { ...richText.content.root, children: nodes } },
})
const richTextIntro = makeRichText([children[0], children[1]])

// ---- Promo (already migrated as a real Promotion doc) ----
const promotionGrid = {
  blockType: 'promotionGrid' as const,
  heading: textOf(children[2]),
  promotions: [12], // health-checkup-packages
}

// ---- 6 category icons (decorative, no real links on source) ----
const iconDefs = [
  { file: 'icon-beauty.png', label: textOf(children[5]) },
  { file: 'icon-vaccine.png', label: textOf(children[6]) },
  { file: 'icon-dental.png', label: textOf(children[7]) },
  { file: 'icon-checkup.png', label: textOf(children[8]) },
  { file: 'icon-food.png', label: textOf(children[9]) },
  { file: 'icon-eyecare.png', label: textOf(children[10]) },
]
const icons: Record<string, number> = {}
for (const def of iconDefs) {
  const media = await uploadImage(`/tmp/hp-assets/${def.file}`, def.label, def.file, 'image/png')
  icons[def.label] = media.id as number
}
const iconGrid = {
  blockType: 'iconGrid' as const,
  heading: null,
  items: iconDefs.map((def) => ({ icon: icons[def.label], label: def.label })),
}

// ---- Hot Deal packages (real Jet Carousel, same recovery as health-mall's) ----
const packages = JSON.parse(readFileSync('/tmp/hp-packages.json', 'utf-8')) as {
  url: string
  price: string
  originalPrice: string
  name: string
  localFile: string
}[]
const hotDealIcon = await uploadImage('/tmp/hp-assets/icon-hotdeal.png', 'Hot Deal', 'hp-hotdeal-icon.png', 'image/png')
const packageIds: number[] = []
for (const [i, p] of packages.entries()) {
  const existingProduct = (
    await payload.find({ collection: 'products', where: { externalUrl: { equals: p.url } }, limit: 1 })
  ).docs[0]
  if (existingProduct) {
    packageIds.push(existingProduct.id as number)
    continue
  }
  const ext = p.localFile.split('.').pop() as string
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg'
  const media = await uploadImage(p.localFile, p.name, `hp-package-${i}.${ext}`, mime)
  const price = Number(p.price.replace(/[฿,\s]/g, ''))
  const originalPrice = Number(p.originalPrice.replace(/[฿,\s]/g, ''))
  const doc = await payload.create({
    collection: 'products',
    data: { title: p.name, image: media.id, price, originalPrice, externalUrl: p.url },
    overrideAccess: true,
  })
  packageIds.push(doc.id as number)
  console.log('created package', doc.id, p.name)
}
const hotDealCarousel = {
  blockType: 'productCarousel' as const,
  heading: textOf(children[11]).replace(/​/g, ''),
  icon: hotDealIcon.id,
  products: packageIds,
}

// ---- Hospital network (reuse all 8 existing Partners, matching homepage's LogoStrip) ----
const allPartners = await payload.find({ collection: 'partners', limit: 20 })
const logoStrip = {
  blockType: 'logoStrip' as const,
  heading: textOf(children[12]).replace(/​/g, ''),
  partners: allPartners.docs.map((p: any) => p.id),
}

// ---- Related articles ----
const articleGrid = { blockType: 'articleGrid' as const, heading: textOf(children[13]), postCount: 3 }

const newLayout = [richTextIntro, promotionGrid, iconGrid, hotDealCarousel, logoStrip, articleGrid]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
