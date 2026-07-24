import { createHash } from 'node:crypto'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'

const HOME_URL = 'https://www.bedee.com/'
const dryRun = process.argv.includes('--dry-run')

const heroSlides = [
  {
    headline: 'ดูแลสุขภาพดี\nทุกที่ ทุกเวลา',
    body: 'พบบริการดูแลสุขภาพที่ครบวงจร ในแอปเดียว ทั้งปรึกษาหมอ ปรึกษาเภสัชกร ช้อปสินค้าสุขภาพ และจัดส่งให้คุณถึงบ้าน ภายใต้มาตรฐานเครือ BDMS ในแอปพลิเคชัน BeDee',
    image: 'https://www.bedee.com/wp-content/uploads/2023/06/Header-01-770x800.png-1.webp',
  },
  {
    headline: 'ปรึกษาหมอ\nได้ทุกที่',
    body: 'สะดวก ปรึกษาหมอผ่านแอป วิดีโอคอลกับแพทย์ได้ทันที หรือนัดหมายผู้เชี่ยวชาญเฉพาะทาง สะดวก ไม่ต้องเดินทาง',
    image: 'https://www.bedee.com/wp-content/uploads/2023/06/Page_TC-770x800.png',
    ctaLabel: 'ดูเพิ่มเติม',
    ctaUrl: 'https://www.bedee.com/teleconsultation',
  },
  {
    headline: 'ปรึกษาเภสัชกร\nเรื่องการใช้ยา',
    body: 'สอบถามเรื่องการใช้ยา วิตามิน และอาหารเสริมอย่างปลอดภัยกับเภสัชกรผู้เชี่ยวชาญ',
    image: 'https://www.bedee.com/wp-content/uploads/2023/06/Page_TP-770x800.png',
    ctaLabel: 'ดูเพิ่มเติม',
    ctaUrl: 'https://bit.ly/bedeetelepharmacist',
  },
  {
    headline: 'มั่นใจช้อปสินค้า\nสุขภาพ',
    body: 'สินค้าทางการแพทย์ และสินค้าเพื่อความงามที่แพทย์แนะนำ พร้อมปรึกษาผลิตภัณฑ์ฟรี ส่งถึงบ้านใน 90 นาที*',
    image: 'https://www.bedee.com/wp-content/uploads/2023/06/Home_HM-1-770x800.png',
    ctaLabel: 'ดูเพิ่มเติม',
    ctaUrl: 'https://www.bedee.com/health-mall',
  },
  {
    headline: 'แพ็กเกจ\nตรวจสุขภาพ',
    body: 'รู้ก่อนรักษาได้ รวมดีลแพ็กเกจตรวจสุขภาพและความงามจากโรงพยาบาลในเครือ BDMS พร้อมส่วนลดพิเศษตลอดทั้งปี',
    image: 'https://www.bedee.com/wp-content/uploads/2023/06/Home_HPZ-1.png',
    ctaLabel: 'ดูเพิ่มเติม',
    ctaUrl: 'https://shop.bedee.com/th?utm_source=bedee&utm_medium=referral&utm_campaign=hero-banner',
  },
]

const serviceItems = [
  {
    label: 'ปรึกษาหมอ',
    url: '/teleconsultation',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Frame-2608320-2.png',
  },
  {
    label: 'ช้อปสินค้าสุขภาพ',
    url: '/health-mall',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Frame-2608320-1-2.png',
  },
  {
    label: 'ปรึกษาเภสัชกร',
    url: '/telepharmacy',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Frame-2608320-2-1.png',
  },
  {
    label: 'ช้อปแพ็กสุขภาพ',
    url: '/health-plaza',
    image: 'https://www.bedee.com/wp-content/uploads/2023/08/sss-1.png',
  },
]

const discoveryItems = [
  {
    label: 'โพสต์ถามหมอ',
    url: 'https://www.bedee.com/community',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Frame-2608527-3.png',
  },
  {
    label: 'บทความ',
    url: '/article',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Icon-AnotherService-2.png',
  },
  {
    label: 'โปรโมชัน',
    url: '/promotions',
    image: 'https://www.bedee.com/wp-content/uploads/2023/07/Icon-AnotherService-3.png',
  },
]

const partners = [
  ['BDMS', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-33203.webp'],
  ['Bangkok Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Logo_Bangkok-Hospital-300x211-1.png'],
  ['Samitivej Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32992.png'],
  ['BNH Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32996.png'],
  ['Phyathai Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32994.png'],
  ['Paolo Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32991.png'],
  ['Royal Bangkok Hospital', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32995.png'],
  ['BDMS Wellness Clinic', 'https://www.bedee.com/wp-content/uploads/2023/03/Group-32990.png'],
] as const

const promoImage =
  'https://www.bedee.com/wp-content/uploads/2023/03/group-33285-1-768x821-1.png'

async function downloadImage(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'BeDee-Payload-Homepage/1.0' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)

  const data = Buffer.from(await response.arrayBuffer())
  const mimetype = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
  const originalName = path.basename(decodeURIComponent(new URL(url).pathname)) || 'image.jpg'
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 10)
  return {
    data,
    mimetype,
    name: `${hash}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '-')}`,
    size: data.length,
  }
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

  return cms().create({
    collection: 'media',
    data: { alt, sourceUrl },
    file: await downloadImage(sourceUrl),
    locale: 'th',
    overrideAccess: true,
  })
}

async function upsertPartner(name: string, logoUrl: string, sortOrder: number) {
  const logo = await upsertMedia(logoUrl, name)
  const existing = await cms().find({
    collection: 'partners',
    where: {
      or: [{ name: { equals: name } }, { logo: { equals: logo.id } }],
    },
    limit: 1,
    overrideAccess: true,
  })
  const data = { name, logo: logo.id, sortOrder }

  if (existing.docs[0]) {
    return cms().update({
      collection: 'partners',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  }
  return cms().create({ collection: 'partners', data, overrideAccess: true })
}

if (dryRun) {
  console.log({
    home: HOME_URL,
    heroSlides: heroSlides.length,
    serviceItems: serviceItems.length,
    discoveryItems: discoveryItems.length,
    partners: partners.length,
  })
  process.exit(0)
}

try {
  const slides = []
  for (const slide of heroSlides) {
    const media = await upsertMedia(slide.image, slide.headline.replace('\n', ' '))
    slides.push({ ...slide, image: media.id })
  }

  const services = []
  for (const item of serviceItems) {
    const media = await upsertMedia(item.image, item.label)
    services.push({ label: item.label, url: item.url, icon: media.id })
  }

  const discoveries = []
  for (const item of discoveryItems) {
    const media = await upsertMedia(item.image, item.label)
    discoveries.push({ label: item.label, url: item.url, icon: media.id })
  }

  const partnerDocs = []
  for (const [index, [name, logoUrl]] of partners.entries()) {
    partnerDocs.push(await upsertPartner(name, logoUrl, index))
  }

  const promo = await upsertMedia(promoImage, 'จัดส่งสินค้าสุขภาพถึงบ้านคุณ')
  const existing = await cms().find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  const data = {
    title: 'หน้าหลัก',
    slug: 'home',
    sourceUrl: HOME_URL,
    layout: [
      { blockType: 'heroCarousel' as const, slides },
      {
        blockType: 'iconGrid' as const,
        heading: 'บริการจาก BeDee',
        variant: 'tinted' as const,
        items: services,
      },
      {
        blockType: 'iconGrid' as const,
        heading: 'สิ่งน่าสนใจอื่นๆ',
        variant: 'plain' as const,
        items: discoveries,
      },
      {
        blockType: 'logoStrip' as const,
        heading: 'BeDee ให้บริการโดย BDMS\nเครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย',
        partners: partnerDocs.map((partner) => partner.id),
      },
      {
        blockType: 'expertTabs' as const,
        heading: 'ผู้เชี่ยวชาญจากโรงพยาบาลในเครือ',
        doctors: [],
      },
      {
        blockType: 'promoBanner' as const,
        heading: 'จัดส่งสินค้าสุขภาพถึงบ้านคุณ',
        body: 'เรามีสินค้าให้เลือกกว่า 2,500 รายการ อาทิ วิตามิน ยาสามัญประจำบ้าน ยารักษาโรค อุปกรณ์ทางการแพทย์ และสินค้าชั้นนำมากมาย พร้อมจัดส่งให้คุณถึงบ้าน ภายใน 90 นาที',
        image: promo.id,
        badgeLabel: 'HEALTH MALL',
        ctaLabel: 'ช้อปเลย',
        ctaUrl: '/health-mall',
      },
      {
        blockType: 'articleGrid' as const,
        heading: 'บทความน่าสนใจจาก BeDee',
        postCount: 5,
      },
    ],
    seo: {
      metaTitle: 'BeDee แพลตฟอร์มให้บริการด้านสุขภาพ ปรึกษาหมอออนไลน์ ส่งยา',
      metaDescription:
        'BeDee แพลตฟอร์มสุขภาพจาก BDMS ให้บริการปรึกษาหมอและเภสัชกรออนไลน์ พร้อมสินค้าสุขภาพและแพ็กเกจตรวจสุขภาพ',
    },
    _status: 'published' as const,
  }

  const page = existing.docs[0]
    ? await cms().update({
        collection: 'pages',
        id: existing.docs[0].id,
        data,
        locale: 'th',
        overrideAccess: true,
      })
    : await cms().create({
        collection: 'pages',
        data,
        locale: 'th',
        overrideAccess: true,
      })

  const verified = await cms().find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    locale: 'th',
    overrideAccess: true,
  })
  if (!verified.docs[0] || verified.docs[0]._status !== 'published') {
    throw new Error('Homepage verification failed')
  }

  console.log({
    action: existing.docs[0] ? 'updated' : 'created',
    pageId: page.id,
    blocks: data.layout.length,
    media: heroSlides.length + serviceItems.length + discoveryItems.length + partners.length + 1,
  })
} finally {
  if (payload) {
    await Promise.race([
      payload.destroy(),
      new Promise<void>((resolve) => setTimeout(resolve, 2_000)),
    ])
  }
}

process.exit(0)
