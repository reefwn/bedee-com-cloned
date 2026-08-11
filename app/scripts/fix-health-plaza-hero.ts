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
const richTextIntro = layout[0]
const children = richTextIntro.content.root.children as any[]
const textOf = (node: any) => (node.children ?? []).map((c: any) => c.text).join('')

const bgHpz = await uploadImage('/tmp/hp-assets/bg-hpz.jpg', 'BeDee Health Plaza', 'hp-bg-hpz.jpg', 'image/jpeg')
const collage = await uploadImage(
  '/tmp/hp-assets/hpz-collage.png',
  'ช้อปแพ็กเกจสุขภาพกับ BeDee',
  'hp-hpz-collage.png',
  'image/png',
)

const heroCarousel = {
  blockType: 'heroCarousel' as const,
  variant: 'dark' as const,
  backgroundImage: bgHpz.id,
  slides: [
    {
      headline: textOf(children[0]),
      body: textOf(children[1]),
      image: collage.id,
    },
  ],
}

const newLayout = [heroCarousel, ...layout.slice(1)]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
