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

const bgTc = await uploadImage('/tmp/tc-assets/bg-tc.jpg', 'BeDee Teleconsultation', 'tc-bg.jpg', 'image/jpeg')

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'teleconsultation' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const heroIndex = layout.findIndex((b) => b.blockType === 'heroCarousel')
if (heroIndex === -1) throw new Error('hero not found')

const newLayout = [...layout]
newLayout[heroIndex] = { ...layout[heroIndex], backgroundImage: bgTc.id }

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
