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

function listItem(children: any[], value: number) {
  return { type: 'listitem', version: 1, value, direction: 'ltr' as const, format: '' as const, indent: 0, children }
}
function list(tag: 'ul' | 'ol', items: any[]) {
  return {
    type: 'list',
    version: 1,
    tag,
    listType: tag === 'ul' ? ('bullet' as const) : ('number' as const),
    start: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: items,
  }
}
function stripBulletPrefix(children: any[]) {
  return children.map((c: any, i: number) => (i === 0 && c.type === 'text' ? { ...c, text: c.text.replace(/^•\s*/, '') } : c))
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'telepharmacy' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const richText = layout.find((b) => b.blockType === 'richTextContent')
const faqBlock = layout.find((b) => b.blockType === 'faq')
const children = richText.content.root.children as any[]

const textOf = (node: any) => (node.children ?? []).map((c: any) => c.text).join('')

// ---- Hero ----
const bgTp = await uploadImage('/tmp/tp-assets/bg-tp.jpg', 'BeDee Telepharmacy', 'tp-bg.jpg', 'image/jpeg')
const collage = await uploadImage(
  '/tmp/tp-assets/tp-collage.png',
  'ปรึกษาเภสัชกรออนไลน์กับ BeDee',
  'tp-collage.png',
  'image/png',
)
const heroBody = `${textOf(children[0])} ${textOf(children[1])}`

const heroCarousel = {
  blockType: 'heroCarousel' as const,
  variant: 'teal' as const,
  backgroundImage: bgTp.id,
  slides: [
    {
      headline: page.title,
      body: heroBody,
      image: collage.id,
      ctaLabel: 'แชทกับเภสัชกร รับคำแนะนำ สั่งซื้อยา',
      ctaUrl: 'https://bit.ly/bedeetelepharmacist',
    },
  ],
}

const makeRichText = (nodes: any[]) => ({
  blockType: 'richTextContent' as const,
  heading: null,
  content: { ...richText.content, root: { ...richText.content.root, children: nodes } },
})

// ---- "ปรึกษา สะดวก ประหยัด" intro ----
const richTextIntro = makeRichText([children[2], children[3]])

// ---- 6 benefit icons ----
const benefitIconDefs = [
  { file: 'icon-quality-advice.png', label: textOf(children[4]) },
  { file: 'icon-med-quality.png', label: textOf(children[5]) },
  { file: 'icon-standard-price.png', label: textOf(children[6]) },
  { file: 'icon-no-consult-fee.png', label: textOf(children[7]) },
  { file: 'icon-variety.png', label: textOf(children[8]) },
  { file: 'icon-delivery.png', label: textOf(children[9]) },
]
const benefitIcons: Record<string, number> = {}
for (const def of benefitIconDefs) {
  const media = await uploadImage(`/tmp/tp-assets/${def.file}`, def.label, def.file, 'image/png')
  benefitIcons[def.label] = media.id as number
}
const benefitIconGrid = {
  blockType: 'iconGrid' as const,
  heading: null,
  items: benefitIconDefs.map((def) => ({ icon: benefitIcons[def.label], label: def.label })),
}

// ---- Steps (real sequential process -> ordered list) ----
const stepItems = children
  .slice(11, 17)
  .map((c, i) => listItem(stripBulletPrefix(c.children), i + 1))
const richTextSteps = makeRichText([children[10], list('ol', stepItems)])

// ---- "ปรึกษาเภสัชกรคุณภาพจาก BDMS" intro ----
const richTextPharmacistsIntro = makeRichText([children[17], children[18]])

// ---- Pharmacists: 3 already exist (ids 6,7,8 from teleconsultation's migration),
// add the 3 missing ones, then reference the FULL doctors roster (matches
// teleconsultation's own expertTabs, which references all doctors+pharmacists
// rather than a page-scoped subset).
const existingDoctors = await payload.find({ collection: 'doctors', limit: 100 })
const existingNames = new Set(existingDoctors.docs.map((d: any) => d.name.replace(/\s+/g, '')))

const newPharmacistDefs = [
  { file: 'pharmacist-krittanon.jpg', name: textOf(children[21]) },
  { file: 'pharmacist-narongsak.jpg', name: textOf(children[27]) },
  { file: 'pharmacist-jirachai.jpg', name: textOf(children[29]) },
]
const newPharmacistIds: number[] = []
for (const def of newPharmacistDefs) {
  if (existingNames.has(def.name.replace(/\s+/g, ''))) continue
  const media = await uploadImage(`/tmp/tp-assets/${def.file}`, def.name, def.file, 'image/jpeg')
  const doc = await payload.create({
    collection: 'doctors',
    data: { name: def.name, photo: media.id, role: 'pharmacist' },
    overrideAccess: true,
  })
  newPharmacistIds.push(doc.id as number)
  console.log('created pharmacist', doc.id, def.name)
}

const allDoctorIds = [...existingDoctors.docs.map((d: any) => d.id), ...newPharmacistIds]
const expertTabs = { blockType: 'expertTabs' as const, heading: null, doctors: allDoctorIds }

// ---- "ปรึกษาเรื่องยากับเภสัชกรออนไลน์ ส่งถึงบ้าน" intro ----
const richTextMedsIntro = makeRichText([children[31], children[32]])

// ---- 4 medicine category icons ----
const medIconDefs = [
  { file: 'icon-med-home.png', label: textOf(children[33]) },
  { file: 'icon-med-treatment.png', label: textOf(children[34]) },
  { file: 'icon-med-prescription.png', label: textOf(children[35]) },
  { file: 'icon-med-traditional.png', label: textOf(children[36]) },
]
const medIcons: Record<string, number> = {}
for (const def of medIconDefs) {
  const media = await uploadImage(`/tmp/tp-assets/${def.file}`, def.label, def.file, 'image/png')
  medIcons[def.label] = media.id as number
}
const medIconGrid = {
  blockType: 'iconGrid' as const,
  heading: null,
  items: medIconDefs.map((def) => ({ icon: medIcons[def.label], label: def.label })),
}

// ---- Medicine list (real disease/med categories -> unordered list) ----
const medListItems = children.slice(38, 48).map((c, i) => listItem(stripBulletPrefix(c.children), i + 1))
const richTextMedList = makeRichText([children[37], list('ul', medListItems)])

// ---- Assemble ----
const articleGrid = { blockType: 'articleGrid' as const, heading: 'บทความที่เกี่ยวข้อง', postCount: 3 }

const newLayout = [
  heroCarousel,
  richTextIntro,
  benefitIconGrid,
  richTextSteps,
  richTextPharmacistsIntro,
  expertTabs,
  richTextMedsIntro,
  medIconGrid,
  richTextMedList,
  faqBlock,
  articleGrid,
]

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
