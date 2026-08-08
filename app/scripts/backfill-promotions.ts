import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Full build-out of the Promotions collection, previously empty (0 docs).
// Both /promotions and /teleconsultation's "โปรโมชันล่าสุด" section were
// flat scraped text with leaked placeholder titles ("Promotion tc",
// "promotion hm", etc.) and no images — despite bedee.com/promotions
// itself being a clean, real WordPress template (11 promo cards + 1
// featured main banner, each linking to a real /promotion/[slug] detail
// page). Extracted all 12 real titles/images/links directly from that
// live page; verified each image is still 200 OK on bedee.com's CDN
// before downloading. No dedicated promotion detail page exists in this
// app, so ctaUrl points to the real bedee.com detail page (external),
// consistent with how this project already links out for FAQs/privacy
// policy where no migrated equivalent exists yet.

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

const promoDefs = [
  {
    slug: 'all-promotions',
    title: 'รวมโปรเด็ด! BeDee / Health Plaza',
    file: 'main-banner.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion-main-banner/allpromotions',
  },
  {
    slug: 'free-online-mentalheath-consultation-for-student',
    title: 'นักศึกษามหาวิทยาลัยธรรมศาสตร์ ปรึกษานักจิตวิทยาคลินิกฟรี ผ่านแอป BeDee',
    file: 'thammasat-free.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/free-online-mentalheath-consultation-for-student',
  },
  {
    slug: 'free-shipping',
    title: 'ช้อปสินค้าสุขภาพใน Health Mall ส่งฟรี!* ทั้งแอป!',
    file: 'free-shipping.png',
    mime: 'image/png',
    ctaUrl: 'https://www.bedee.com/promotion/free-shipping',
  },
  {
    slug: 'semaglutide-injection',
    title: 'คุมความหิว ดูแลรูปร่าง ด้วยผลิตภัณฑ์จัดการน้ำหนัก พร้อมคุณหมอ พยาบาล นักกำหนดอาหาร และ AI โค้ช คอยดูแล',
    file: 'semaglutide.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/semaglutide-injection',
  },
  {
    slug: 'thai-life-teleconsultation',
    title: 'ลูกค้า Thai Life ไทยประกันชีวิต ปรึกษาแพทย์ที่ BeDee เคลมค่ารักษาผู้ป่วยนอก (OPD)* ไม่ต้องสำรองจ่าย',
    file: 'thai-life.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/thai-life-teleconsultation',
  },
  {
    slug: 'teleconsultation-thammasat-student',
    title: 'นักศึกษาและบุคลากรของมหาวิทยาลัยธรรมศาสตร์ ปรึกษานักจิตวิทยาคลินิกที่แอปฯ BeDee ไม่มีค่าใช้จ่าย',
    file: 'thammasat-student.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/teleconsultation-thammasat-student',
  },
  {
    slug: 'july-2025',
    title: 'แจกโค้ดปรึกษานักจิตวิทยา ไม่มีค่าใช้จ่าย! + ส่วนลด 15% สำหรับปรึกษาแพทย์/ที่ปรึกษาสุขภาพผ่านแอป BeDee',
    file: 'july-2025.png',
    mime: 'image/png',
    ctaUrl: 'https://www.bedee.com/promotion/%e0%b9%88%e0%b8%b5july-2025',
  },
  {
    slug: 'teleconsult-freedelivery',
    title: 'เจ็บป่วย ปรึกษาแพทย์ออนไลน์ ไม่มีค่าจัดส่งยา!',
    file: 'teleconsult-freedelivery.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/teleconsult-freedelivery',
  },
  {
    slug: 'telepharmacy-delivery',
    title: 'ปรึกษาเภสัชกร BeDee ได้จากทุกที่ พร้อมส่งถึงบ้าน!',
    file: 'telepharmacy-delivery.jpg',
    mime: 'image/jpeg',
    ctaUrl: 'https://www.bedee.com/promotion/telepharmacy-delivery',
  },
  {
    slug: 'doctor-team-quality',
    title: 'ทีมแพทย์คุณภาพ พร้อมให้คำปรึกษา',
    file: 'doctor-team.jpg',
    mime: 'image/jpeg',
    ctaUrl:
      'https://www.bedee.com/promotion/%e0%b8%97%e0%b8%b5%e0%b8%a1%e0%b9%81%e0%b8%9e%e0%b8%97%e0%b8%a2%e0%b9%8c%e0%b8%84%e0%b8%b8%e0%b8%93%e0%b8%a0%e0%b8%b2%e0%b8%9e%e0%b8%9e%e0%b8%a3%e0%b9%89%e0%b8%ad%e0%b8%a1%e0%b9%83%e0%b8%ab%e0%b9%89',
  },
  {
    slug: 'pharmacist-team-quality',
    title: 'เภสัชกรคุณภาพ มาตรฐาน BDMS พร้อมให้บริการ',
    file: 'pharmacist-team.jpg',
    mime: 'image/jpeg',
    ctaUrl:
      'https://www.bedee.com/promotion/%e0%b9%80%e0%b8%a0%e0%b8%aa%e0%b8%b1%e0%b8%8a%e0%b8%84%e0%b8%b8%e0%b8%93%e0%b8%a0%e0%b8%b2%e0%b8%9e-%e0%b8%9e%e0%b8%a3%e0%b9%89%e0%b8%ad%e0%b8%a1%e0%b9%83%e0%b8%ab%e0%b9%89%e0%b8%9a%e0%b8%a3%e0%b8%b4',
  },
  {
    slug: 'health-checkup-packages',
    title: 'แพ็กตรวจสุขภาพ วัคซีน ราคาพิเศษ จากเครือ BDMS',
    file: 'health-checkup.jpg',
    mime: 'image/jpeg',
    ctaUrl:
      'https://www.bedee.com/promotion/%e0%b9%81%e0%b8%9e%e0%b9%87%e0%b8%81%e0%b8%95%e0%b8%a3%e0%b8%a7%e0%b8%88%e0%b8%aa%e0%b8%b8%e0%b8%82%e0%b8%a0%e0%b8%b2%e0%b8%9e-%e0%b8%a7%e0%b8%b1%e0%b8%84%e0%b8%8b%e0%b8%b5%e0%b8%99-%e0%b9%82%e0%b8%9b',
  },
]

const promoDocs: Record<string, { id: number }> = {}
for (const def of promoDefs) {
  const media = await uploadImage(
    `/tmp/promo-assets/${def.file}`,
    def.title,
    `promo-${def.slug}.${def.file.split('.').pop()}`,
    def.mime,
  )
  const doc = await payload.create({
    collection: 'promotions',
    data: { title: def.title, slug: def.slug, banner: media.id, ctaUrl: def.ctaUrl },
    overrideAccess: true,
  })
  promoDocs[def.slug] = { id: doc.id as number }
  console.log('Created promotion', def.slug, '->', doc.id)
}

// /promotions page: replace the flat scraped richTextContent entirely —
// every bit of its content was promo listings, now fully superseded by
// real structured data.
const promotionsPage = (
  await payload.find({ collection: 'pages', where: { slug: { equals: 'promotions' } }, limit: 1 })
).docs[0]
if (!promotionsPage) throw new Error('promotions page not found')

await payload.update({
  collection: 'pages',
  id: promotionsPage.id,
  data: {
    layout: [
      {
        blockType: 'promotionGrid',
        heading: 'โปรโมชันล่าสุด',
        promotions: promoDefs.map((d) => promoDocs[d.slug].id),
      },
    ],
  },
  overrideAccess: true,
})
console.log('Rebuilt /promotions page with promotionGrid (12 items)')

// /teleconsultation page: trim the flat "โปรโมชันล่าสุด" section (heading +
// 5 promo paragraphs) from its richTextContent tail, insert a promotionGrid
// block right after with the 5 promotions verified to actually appear on
// this specific page (confirmed via its own related-promotions widget).
const tcPage = (
  await payload.find({ collection: 'pages', where: { slug: { equals: 'teleconsultation' } }, limit: 1 })
).docs[0]
if (!tcPage) throw new Error('teleconsultation page not found')

const tcLayout = tcPage.layout as any[]
const richTextBIndex = tcLayout.findIndex((b) => b.blockType === 'richTextContent' && b.content.root.children.some((c: any) => (c.children ?? []).some((cc: any) => cc.text === 'โปรโมชันล่าสุด')))
if (richTextBIndex === -1) throw new Error('could not find the richTextContent block with the promo section')

const richTextB = tcLayout[richTextBIndex].content
const promoHeadingIndex = richTextB.root.children.findIndex(
  (c: any) => c.type === 'heading' && (c.children ?? [])[0]?.text === 'โปรโมชันล่าสุด',
)
if (promoHeadingIndex === -1) throw new Error('promo heading not found in richTextB')

const trimmedRichTextB = {
  ...richTextB,
  root: { ...richTextB.root, children: richTextB.root.children.slice(0, promoHeadingIndex) },
}

const tcPromoSlugs = [
  'semaglutide-injection',
  'thai-life-teleconsultation',
  'teleconsultation-thammasat-student',
  'july-2025',
  'teleconsult-freedelivery',
]

const newTcLayout = [...tcLayout]
newTcLayout[richTextBIndex] = { ...tcLayout[richTextBIndex], content: trimmedRichTextB }
newTcLayout.splice(richTextBIndex + 1, 0, {
  blockType: 'promotionGrid',
  heading: 'โปรโมชันล่าสุด',
  promotions: tcPromoSlugs.map((slug) => promoDocs[slug].id),
})

await payload.update({
  collection: 'pages',
  id: tcPage.id,
  data: { layout: newTcLayout },
  overrideAccess: true,
})
console.log('Updated /teleconsultation with promotionGrid (5 items)')

process.exit(0)
