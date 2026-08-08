import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Follow-up correction: the previous visuals pass inserted a single static
// image (Page_TC.png) into the steps section as a stand-in for "some visual
// support," believing the source's own 5-slide image carousel was
// unrecoverable (its swiper-slide-bg divs are empty on the live site, with
// no data-lazy-src to fall back on, unlike the icon-grid case).
//
// It wasn't unrecoverable — the real per-slide background-image URLs are
// embedded in an Elementor critical-CSS JSON blob in a <script> tag, keyed
// by each slide's repeater-item hash (e.g. ".elementor-repeater-item-4b7ac34
// .swiper-slide-bg{...url('.../140524-Web_TC_Page_01-TC.jpg')}"). Extracted
// all 5, in order, from the Wayback Machine's 2025-01-26 capture; verified
// each is still a live 200 OK file on bedee.com's own CDN; visually confirmed
// each slide matches the corresponding numbered step (1-5) in the text list
// above it. Also read the carousel widget's real data-settings config off
// the live site: { autoplay: yes, autoplay_speed: 2000, navigation: both,
// pause_on_hover: yes, pause_on_interaction: yes, infinite: yes,
// transition: slide, transition_speed: 500 } — implemented as the new
// ImageCarousel component/imageCarousel block accordingly.

const payload = await getPayload({ config })

async function uploadImage(path: string, alt: string, filename: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
    overrideAccess: true,
  })
}

const slideAlts = [
  'ขั้นตอนที่ 1: ดาวน์โหลดแอป BeDee และลงทะเบียนผู้ใช้งาน',
  'ขั้นตอนที่ 2: เลือกปรึกษาแพทย์ออนไลน์',
  'ขั้นตอนที่ 3: ระบุอาการเบื้องต้น',
  'ขั้นตอนที่ 4: ชำระค่าปรึกษาแพทย์',
  'ขั้นตอนที่ 5: รับคำปรึกษาผ่านวิดีโอคอล',
]

const slides = await Promise.all(
  [1, 2, 3, 4, 5].map((n, i) =>
    uploadImage(
      `/tmp/tc-carousel/slide-0${n}.jpg`,
      slideAlts[i],
      `tc-carousel-step-0${n}.jpg`,
    ),
  ),
)

const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'teleconsultation' } },
  limit: 1,
})
const page = result.docs[0]
if (!page) throw new Error('page not found')

const existingLayout = page.layout as any[]
const richText1 = existingLayout[0].content
// Drop the single stand-in "upload" node that was the last child of richText1.
const lastNode = richText1.root.children[richText1.root.children.length - 1]
if (lastNode?.type !== 'upload') throw new Error('expected last richText1 node to be the stand-in upload node')
const trimmedRichText1 = {
  ...richText1,
  root: { ...richText1.root, children: richText1.root.children.slice(0, -1) },
}

const newLayout = [...existingLayout]
newLayout[0] = { ...existingLayout[0], content: trimmedRichText1 }
newLayout.splice(1, 0, {
  blockType: 'imageCarousel',
  images: slides.map((s) => ({ image: s.id })),
})

await payload.update({
  collection: 'pages',
  id: page.id,
  data: { layout: newLayout },
  overrideAccess: true,
})

console.log('Uploaded 5 carousel slides and inserted imageCarousel block on page', page.id)
process.exit(0)
