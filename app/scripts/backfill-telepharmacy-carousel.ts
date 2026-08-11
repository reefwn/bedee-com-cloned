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

const slideIds: number[] = []
for (let i = 1; i <= 5; i++) {
  const n = String(i).padStart(2, '0')
  const filename = `tp-carousel-step-${n}.jpg`
  const existing = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })).docs[0]
  if (existing) {
    slideIds.push(existing.id as number)
    continue
  }
  const media = await uploadImage(
    `/tmp/tp-carousel/slide-${n}.jpg`,
    `ขั้นตอนปรึกษาเภสัชกรออนไลน์กับ BeDee ${i}`,
    filename,
    'image/jpeg',
  )
  slideIds.push(media.id as number)
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]

const stepsIndex = layout.findIndex(
  (b) => b.blockType === 'richTextContent' && JSON.stringify(b.content).includes('ขั้นตอนปรึกษาเภสัชกรออนไลน์จาก BeDee'),
)
if (stepsIndex === -1) throw new Error('steps richText block not found')

const imageCarousel = {
  blockType: 'imageCarousel' as const,
  heading: null,
  images: slideIds.map((id) => ({ image: id })),
}

const newLayout = [...layout.slice(0, stepsIndex + 1), imageCarousel, ...layout.slice(stepsIndex + 1)]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
