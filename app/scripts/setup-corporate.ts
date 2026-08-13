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

const assets = [
  ['/tmp/corporate-assets/hero.png', 'สุขภาพพนักงาน คือหัวใจขององค์กร', 'corporate-hero.png', 'image/png'],
  ['/tmp/corporate-assets/ecosystem.png', 'Healthcare Ecosystem Platform', 'corporate-ecosystem.png', 'image/png'],
  [
    '/tmp/corporate-assets/mental-health-phones.png',
    'BeDee Mental Health บนแอปพลิเคชัน',
    'corporate-mental-health-phones.png',
    'image/png',
  ],
  ['/tmp/corporate-assets/icon-checkup.png', 'Health Checkup', 'corporate-icon-checkup.png', 'image/png'],
  ['/tmp/corporate-assets/icon-network.png', 'Personalized Healthcare', 'corporate-icon-network.png', 'image/png'],
  ['/tmp/corporate-assets/team.png', 'ทีมแพทย์ BeDee by BDMS', 'corporate-team.png', 'image/png'],
  ['/tmp/corporate-assets/icon-persona.png', 'BDMS Network', 'corporate-icon-persona.png', 'image/png'],
  ['/tmp/corporate-assets/icon-hr.png', 'HR Portal', 'corporate-icon-hr.png', 'image/png'],
  ['/tmp/corporate-assets/staff-clinic.png', 'Staff Clinic', 'corporate-staff-clinic.png', 'image/png'],
  [
    '/tmp/corporate-assets/partners-frame.png',
    'องค์กรพันธมิตรของ BeDee',
    'corporate-partners-frame.png',
    'image/png',
  ],
] as const

for (const [path, alt, filename, mimetype] of assets) {
  const media = await uploadImage(path, alt, filename, mimetype)
  console.log(filename, '->', media.id)
}

const staleDoc = (await payload.find({ collection: 'pages', where: { slug: { equals: 'corporate' } }, limit: 1 }))
  .docs[0]
if (staleDoc) {
  await payload.delete({ collection: 'pages', id: staleDoc.id, overrideAccess: true })
  console.log('deleted stale pages doc', staleDoc.id)
} else {
  console.log('no stale pages doc found')
}

process.exit(0)
