import { getPayload } from 'payload'
import config from '../src/payload.config'

// One-off backfill for the "does not contain all information from the
// original page" report on /article/wellness/child-health-checkup-kit.
// The WP migration's content parser stopped after the last h3 section and
// never captured the FAQ widget, closing summary, or References — all
// verified verbatim against https://www.bedee.com/articles/wellness/child-health-checkup-kit.
// Already run against the prod Supabase DB; committing for audit trail.

const payload = await getPayload({ config })

function para(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
    direction: 'ltr',
    textStyle: '',
    textFormat: 0,
  }
}

function heading(tag: 'h2' | 'h3', text: string) {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
    direction: 'ltr',
    textStyle: '',
    textFormat: 0,
  }
}

const result = await payload.find({
  collection: 'posts',
  where: { slug: { equals: 'child-health-checkup-kit' } },
  limit: 1,
})
const post = result.docs[0]
if (!post) throw new Error('post not found')
if (!post.content) throw new Error('post has no content')

const closingNodes = [
  heading('h2', 'ตรวจสุขภาพเด็ก ช่วยติดตามการเติบโตและพัฒนาการลูกน้อย ป้องกันโรครุนแรง'),
  para(
    'การตรวจสุขภาพเด็กเป็นสิ่งสำคัญ เพราะจะช่วยให้คุณพ่อคุณแม่มั่นใจว่าลูกเติบโตสมวัย แข็งแรง และปลอดภัยจากโรคแอบแฝง ตรวจพบปัญหาเร็ว ลดความเสี่ยงในการเกิดโรคร้ายแรงในอนาคต พร้อมทั้งช่วยให้ลูกมีคุณภาพชีวิตที่ดี และพร้อมสำหรับการเรียนและการใช้ชีวิต',
  ),
  para('ช้อปแพ็กเกจสุขภาพได้เลยที่ Health Plaza รวมแพ็กเกจตรวจสุขภาพมาตรฐาน BDMS สะดวก ใช้งานง่าย พร้อมส่วนลดพิเศษ'),
  para('สอบถามเพิ่มเติม Line Official : @healthplaza'),
  para('Content powered by BeDee Expert'),
  para('เรียบเรียงโดย กรวรรณ ใจซื่อกุล'),
]

const content = {
  ...post.content,
  root: {
    ...post.content.root,
    children: [...post.content.root.children, ...closingNodes],
  },
}

const faqs = [
  {
    question: 'ทำไมถึงควรตรวจสุขภาพเด็ก?',
    answer:
      'การตรวจสุขภาพเด็กช่วยคัดกรองโรคตั้งแต่เนิ่น ๆ ทำให้ตรวจพบปัญหาได้เร็ว เพิ่มโอกาสในการรักษา และทำให้เด็ก ๆ เติบโตสมวัยอย่างแข็งแรง ช่วยให้คุณพ่อคุณแม่ติดตามพัฒนาการของลูกน้อย และดูแลสร้างภูมิคุ้มกันให้แข็งแรง',
  },
  {
    question: 'ตรวจสุขภาพนักเรียน ตรวจอะไรบ้าง?',
    answer:
      'การตรวจสุขภาพนักเรียนนั้นมีแนวทางเช่นเดียวกับการตรวจสุขภาพเด็กทั่วไป คือการตรวจร่างกายทั่วไปโดยแพทย์ ตรวจเลือด ตรวจปัสสาวะ ตรวจช่องปากและฟัน และตรวจการมองเห็น นอกจากนี้หากมีกังวลด้านอื่น ๆ เป็นพิเศษสามารถตรวจเพิ่มเติมได้',
  },
]

const references = [
  {
    text: 'American Academy of Pediatrics. (2025, July 15). "Well-child care: A check-up for success". HealthyChildren.org.',
    url: 'https://www.healthychildren.org/English/family-life/health-management/Pages/Well-Child-Care-A-Check-Up-for-Success.aspx',
  },
  {
    text: 'Australian Government, Department of Health and Aged Care. (2023, June 20). Health checks for babies and children. Pregnancy Birth and Baby.',
    url: 'https://www.pregnancybirthbaby.org.au/health-checks-for-babies-and-children',
  },
  {
    text: "Nationwide Children's Hospital. (n.d.). Health screening guidelines for children from birth to age 2. Nationwide Children's Hospital.",
  },
]

await payload.update({
  collection: 'posts',
  id: post.id,
  data: {
    content,
    faqs,
    references,
    relatedPosts: [215, 229],
  },
  overrideAccess: true,
})

console.log('Updated post', post.id)
process.exit(0)
