import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

async function uploadImage(path: string, alt: string, filename: string, mimetype: string) {
  const existing = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 }))
    .docs[0]
  if (existing) return existing
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
    overrideAccess: true,
  })
}

const hero = await uploadImage('/tmp/contact-assets/hero.jpg', 'ติดต่อเรา BeDee', 'contact-us-hero.jpg', 'image/jpeg')
console.log('hero media id:', hero.id)

const staleDoc = (await payload.find({ collection: 'pages', where: { slug: { equals: 'contact-us' } }, limit: 1 }))
  .docs[0]
if (staleDoc) {
  await payload.delete({ collection: 'pages', id: staleDoc.id, overrideAccess: true })
  console.log('deleted stale pages doc', staleDoc.id)
} else {
  console.log('no stale pages doc found')
}

process.exit(0)
