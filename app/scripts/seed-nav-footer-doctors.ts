import { createHash } from 'node:crypto'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'

const dryRun = process.argv.includes('--dry-run')

// Sourced verbatim from the live bedee.com header/footer (fetched 2026-08-06) —
// see /impeccable critique findings: header.navItems and footer.linkGroups were
// both empty on the deployed site. Internal paths point at this app's own
// routes per PRODUCT.md's "independence from the original site" principle;
// /faqs and /privacy-policy have no migrated page yet, so those two links
// point at bedee.com temporarily rather than 404ing or being invented.
const NAV_ITEMS = [
  {
    label: 'บริการของเรา',
    url: '#',
    children: [
      { label: 'ปรึกษาหมอ', url: '/teleconsultation' },
      { label: 'ปรึกษาเภสัชกร', url: '/telepharmacy' },
      { label: 'ช้อปสินค้าสุขภาพ', url: '/health-mall' },
      { label: 'ช้อปแพ็กสุขภาพ', url: 'https://shop.bedee.com/th' },
    ],
  },
  { label: 'โปรโมชันล่าสุด', url: '/promotions' },
  {
    label: 'บทความ',
    url: '#',
    children: [
      { label: 'บทความสุขภาพ', url: '/article' },
      { label: 'ข่าวสารและกิจกรรม', url: '/news-activities' },
    ],
  },
  { label: 'สำหรับองค์กร', url: '/corporate' },
  { label: 'ติดต่อเรา', url: '/contact-us' },
]

const FOOTER_LINK_GROUPS = [
  {
    heading: 'บริการของเรา',
    links: [
      { label: 'ปรึกษาหมอ', url: '/teleconsultation' },
      { label: 'ปรึกษาเภสัชกร', url: '/telepharmacy' },
      { label: 'ช้อปสินค้าสุขภาพ', url: '/health-mall' },
      { label: 'ช้อปแพ็กสุขภาพ', url: '/health-plaza' },
    ],
  },
  {
    heading: 'บทความ',
    links: [
      { label: 'บทความสุขภาพ', url: '/article' },
      { label: 'ข่าวสารและกิจกรรม', url: '/news-activities' },
      { label: 'โปรโมชัน', url: '/promotions' },
    ],
  },
  {
    heading: 'เกี่ยวกับเรา',
    links: [
      { label: 'คำถามที่พบบ่อย', url: 'https://www.bedee.com/faqs' }, // TODO: no /faqs page migrated yet
      { label: 'ติดต่อเรา', url: '/contact-us' },
    ],
  },
  {
    heading: 'กฏหมาย',
    links: [
      { label: 'นโยบายความเป็นส่วนตัว', url: 'https://www.bedee.com/privacy-policy' }, // TODO: not migrated yet
    ],
  },
]

const SOCIAL_LINKS: Array<{ platform: 'facebook' | 'line' | 'instagram'; url: string }> = [
  { platform: 'facebook', url: 'https://www.facebook.com/BeDeebyBDMS' },
  { platform: 'line', url: 'https://line.me/ti/p/~@bedeebybdms' },
  { platform: 'instagram', url: 'https://www.instagram.com/bedee_by_bdms/' },
]

// Real named doctors/pharmacists + real photo URLs, scraped live from
// bedee.com/teleconsultation and /telepharmacy (2026-08-06). Hospital
// affiliation is not individually stated on the source page (only "BDMS
// network" generally) so `hospital` is left unset rather than invented.
const DOCTORS: Array<{ name: string; role: 'doctor' | 'pharmacist'; photoUrl: string }> = [
  {
    name: 'พญ.สุรีย์พร ศรีตั้งรัตนกุล',
    role: 'doctor',
    photoUrl:
      'https://www.bedee.com/wp-content/uploads/2023/06/พญ.สุรีย์พร-ศรีตั้งรัตนกุล-550x550.jpg',
  },
  {
    name: 'พญ.ชนกนันท์ จรเสมอ',
    role: 'doctor',
    photoUrl: 'https://www.bedee.com/wp-content/uploads/2023/06/พญ.ชนกนันท์-จรเสมอ-Dermatologist-550x503.jpg',
  },
  {
    name: 'พญ.สร้อยเพชร ประเทืองเศรษฐ์',
    role: 'doctor',
    photoUrl:
      'https://www.bedee.com/wp-content/uploads/2023/06/พญ.สร้อยเพชร-ประเทืองเศรษฐ์-Preventive-medicine.jpg',
  },
  {
    name: 'พญ.ศิรินรัตน์ ตั้งจิตตรง',
    role: 'doctor',
    photoUrl:
      'https://www.bedee.com/wp-content/uploads/2023/06/พญ.ศิรินรัตน์-ตั้งจิตตรง-อายุรแพทย์สาขาต่อมไร้ท่อและเมตะบอลิสม-550x550.jpg',
  },
  {
    name: 'พญ.ศรินยา จิตรวาณิช',
    role: 'doctor',
    photoUrl: 'https://www.bedee.com/wp-content/uploads/2023/06/พญ.ศรินยา-จิตรวาณิช-Dermatologist-550x550.jpg',
  },
  {
    name: 'ภก.นัทพล มะลิซ้อน',
    role: 'pharmacist',
    photoUrl: 'https://www.bedee.com/wp-content/uploads/2023/07/ภก.นัทพล-มะลิซ้อน-เภสัชกร.jpg',
  },
  {
    name: 'ภญ.สิริยาภรณ์ รักษาเชื้อ',
    role: 'pharmacist',
    photoUrl:
      'https://www.bedee.com/wp-content/uploads/2023/07/ภญ.สิริยาภรณ์-รักษาเชื้อ-เภสัชกร-550x550.jpg',
  },
  {
    name: 'ภญ. วุฒิรัต ธรรมวุฒิ',
    role: 'pharmacist',
    photoUrl: 'https://www.bedee.com/wp-content/uploads/2023/08/ภญ.-วุฒิรัต-ธรรมวุฒิ.png',
  },
]

async function downloadImage(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'BeDee-Payload-Seed/1.0' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  const data = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
  const originalName = path.basename(decodeURIComponent(new URL(url).pathname)) || 'image.jpg'
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 10)
  const name = `${hash}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  return { data, mimetype: contentType, name, size: data.length }
}

const payload = dryRun ? undefined : await getPayload({ config })

function cms(): Payload {
  if (!payload) throw new Error('Payload is unavailable during a dry run')
  return payload
}

async function upsertMedia(sourceUrl: string, alt: string) {
  const existing = await cms().find({
    collection: 'media',
    where: { sourceUrl: { equals: sourceUrl } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]

  const file = await downloadImage(sourceUrl)
  return cms().create({
    collection: 'media',
    data: { alt, sourceUrl },
    file,
    locale: 'th',
    overrideAccess: true,
  })
}

async function seedHeader() {
  if (dryRun) return console.log('[dry-run] would set header.navItems:', NAV_ITEMS.length, 'items')
  await cms().updateGlobal({
    slug: 'header',
    data: { navItems: NAV_ITEMS },
    locale: 'th',
    overrideAccess: true,
  })
  console.log('Updated header.navItems')
}

async function seedFooter() {
  if (dryRun) {
    return console.log(
      '[dry-run] would set footer.linkGroups:',
      FOOTER_LINK_GROUPS.length,
      'groups + socialLinks:',
      SOCIAL_LINKS.length,
    )
  }
  await cms().updateGlobal({
    slug: 'footer',
    data: {
      tagline: 'Powered by BDMS',
      linkGroups: FOOTER_LINK_GROUPS,
      socialLinks: SOCIAL_LINKS,
    },
    locale: 'th',
    overrideAccess: true,
  })
  console.log('Updated footer.linkGroups + socialLinks')
}

async function seedDoctors(): Promise<number[]> {
  const ids: number[] = []
  for (const doc of DOCTORS) {
    if (dryRun) {
      console.log('[dry-run] would upsert doctor:', doc.name, doc.role)
      continue
    }
    const media = await upsertMedia(doc.photoUrl, doc.name)
    const existing = await cms().find({
      collection: 'doctors',
      where: { name: { equals: doc.name } },
      limit: 1,
      locale: 'th',
      overrideAccess: true,
    })
    const data = { name: doc.name, role: doc.role, photo: media.id }
    if (existing.docs[0]) {
      await cms().update({ collection: 'doctors', id: existing.docs[0].id, data, locale: 'th', overrideAccess: true })
      ids.push(existing.docs[0].id)
      console.log('Updated doctor:', doc.name)
    } else {
      const created = await cms().create({ collection: 'doctors', data, locale: 'th', overrideAccess: true })
      ids.push(created.id)
      console.log('Created doctor:', doc.name)
    }
  }
  return ids
}

// The homepage's `expertTabs` block carries its own `doctors` relationship
// array (RenderBlocks passes block.doctors straight through) — creating
// Doctors docs alone does not populate it. Find the home page's layout,
// locate the expertTabs block, and wire the new doctor IDs into it.
async function wireHomeExpertTabs(doctorIds: number[]) {
  if (dryRun || doctorIds.length === 0) {
    return console.log('[dry-run] would set home page expertTabs.doctors to', doctorIds.length, 'ids')
  }
  const home = await cms().find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const page = home.docs[0]
  if (!page) return console.warn('No "home" page found — skipping expertTabs wiring')

  const layout = Array.isArray(page.layout) ? page.layout : []
  const idx = layout.findIndex((block: { blockType?: string }) => block.blockType === 'expertTabs')
  if (idx === -1) return console.warn('No expertTabs block on home page — skipping')

  const newLayout = layout.map((block, i) => (i === idx ? { ...block, doctors: doctorIds } : block))
  await cms().update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
  console.log('Wired', doctorIds.length, 'doctors into home page expertTabs block')
}

await seedHeader()
await seedFooter()
const doctorIds = await seedDoctors()
await wireHomeExpertTabs(doctorIds)

if (payload) {
  await Promise.race([payload.destroy(), new Promise<void>((resolve) => setTimeout(resolve, 2_000))])
}

process.exit(0)
