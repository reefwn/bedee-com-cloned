import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Follow-up to backfill-teleconsultation-page.ts. That pass explicitly left
// out the source's benefits-icon-grid and steps-carousel visuals because the
// live bedee.com/teleconsultation page currently renders them broken/empty.
// Checked the Wayback Machine capture from 2025-01-26 (before whatever broke
// them): the underlying <img> src URLs are still real, live files on
// bedee.com's own CDN (verified 200 OK on every one) — the live page's own
// lazy-load/slider JS is what's broken, not the assets. Downloaded them
// directly from bedee.com and re-hosting in our own Media storage, per this
// project's "never hotlink bedee.com" principle.
//
// The steps-section "carousel" only ever yielded ONE image from the archive
// capture (Page_TC.png) — Elementor sliders commonly only pre-render slide 1
// in the initial DOM, so the other slides (if they exist) aren't recoverable
// this way. Using this one real image as a static supporting visual next to
// the steps list, not fabricating a multi-slide carousel we have no content
// for.

const payload = await getPayload({ config })

async function uploadImage(path: string, alt: string, filename: string) {
  const data = readFileSync(path)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: filename, size: data.length },
    overrideAccess: true,
  })
}

const [
  iconDoctors,
  iconFlexibleTime,
  icon247,
  iconPrice,
  iconReferral,
  iconCertificate,
  stepsScreenshot,
] = await Promise.all([
  uploadImage('/tmp/tc-assets/icon1-doctors.png', 'ทีมแพทย์และผู้เชี่ยวชาญจาก BDMS', 'tc-icon-doctors.png'),
  uploadImage('/tmp/tc-assets/icon2-flexible-time.png', 'เลือกเวลาที่คุณสะดวก', 'tc-icon-flexible-time.png'),
  uploadImage('/tmp/tc-assets/icon3-24-7.png', 'ให้บริการ 24/7', 'tc-icon-24-7.png'),
  uploadImage('/tmp/tc-assets/icon4-price.png', 'ราคามาตรฐาน', 'tc-icon-price.png'),
  uploadImage('/tmp/tc-assets/icon5-referral.png', 'ส่งต่อการรักษา', 'tc-icon-referral.png'),
  uploadImage('/tmp/tc-assets/icon6-certificate.png', 'รับใบรับรองแพทย์และใบเสร็จได้ทันที', 'tc-icon-certificate.png'),
  uploadImage(
    '/tmp/tc-assets/steps-app-screenshot.png',
    'ปรึกษาหมอออนไลน์ผ่านแอป BeDee',
    'tc-steps-app-screenshot.png',
  ),
])

function para(text: string) {
  return {
    type: 'paragraph',
    format: '' as const,
    indent: 0,
    version: 1,
    children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
    direction: 'ltr' as const,
    textStyle: '',
    textFormat: 0,
  }
}

function heading(tag: 'h2' | 'h3' | 'h4', text: string) {
  return {
    type: 'heading',
    tag,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
    direction: 'ltr' as const,
    textStyle: '',
    textFormat: 0,
  }
}

function uploadNode(mediaId: number) {
  return {
    type: 'upload',
    version: 3,
    format: '' as const,
    id: randomBytes(12).toString('hex'),
    relationTo: 'media',
    value: mediaId,
    fields: null,
  }
}

const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'teleconsultation' } },
  limit: 1,
})
const page = result.docs[0]
if (!page) throw new Error('page not found')

const richText1 = {
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      para('พร้อมรับยาที่บ้าน ป่วยเมื่อไหร่เปิดแอปปรึกษาหมอ BeDee'),
      para(
        'BeDee แอปพลิเคชันที่ครบครันเรื่องการปรึกษาหมอออนไลน์ ปรึกษาเภสัชกร รับยา ได้ทุกที่ ทุกวัน และยังมีสินค้าเพื่อสุขภาพและสินค้าทางการแพทย์ระดับคุณภาพให้เลือกช้อป จัดส่งสินค้าถึงมือ',
      ),
      heading('h2', 'BeDee คืออะไร'),
      para(
        'แอปพลิเคชัน BeDee เป็นมากกว่าแอปพลิเคชันปรึกษาหมอออนไลน์ทั่วไป อัดแน่นด้วยฟีเจอร์ด้านสุขภาพ ครบครัน และเหนือกว่าด้วยประสบการณ์จากเครือ BDMS เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทยที่ประกอบไปด้วยโรงพยาบาลชั้นนำกว่า 58 แห่ง อย่างโรงพยาบาลกรุงเทพ โรงพยาบาลสมิติเวช โรงพยาบาลพญาไท โรงพยาบาล BNH โรงพยาบาลเปาโล และอื่น ๆ อีกมากมาย',
      ),
      para(
        'ด้วยประสบการณ์อันยาวนาน ความเชี่ยวชาญ และทีมบุคลากรคุณภาพชั้นนำจากเครือ BDMS วันนี้แอป BeDee พร้อมดูแลสุขภาพคนไทยด้วย 3 บริการหลักอย่าง ปรึกษาหมอออนไลน์ ปรึกษาเภสัชกรออนไลน์ และช้อปปิ้งสินค้าสุขภาพและสินค้าทางการแพทย์ออนไลน์บนแอป พร้อมจัดส่งสินค้าถึงมือทั่วไทย',
      ),
      heading('h2', 'ทำไมต้องปรึกษาหมอออนไลน์กับ BeDee'),
      para('เราช่วยให้คุณเข้าถึงบริการด้านสุขภาพ ที่ได้มาตรฐานเพียงปลายนิ้วสัมผัส ที่สำคัญ หาหมอส่งยาแบบไม่มีค่าใช้จ่าย ได้ทั่วไทย'),
      para(
        'ไม่ใช่แค่ปรึกษาอาการป่วยทั่วไปเท่านั้น BeDee ช่วยให้คุณปรึกษาอาการกับทีมแพทย์และผู้เชี่ยวชาญหลากหลายสาขาจาก BDMS ผ่านแอปพลิเคชันได้อย่างง่าย ๆ ช่วยให้ผู้ป่วยเข้าถึงผู้เชี่ยวชาญที่มากความสามารถ ได้รับข้อมูลและบริการที่มีมาตรฐาน เชื่อถือได้ ช่วยรวมศูนย์แพทย์ชื่อดังมากความสามารถไว้ในที่เดียว แอป BeDee ครอบคลุมกลุ่มอาการกว่า 12 สาขา เช่น',
      ),
      para('• กลุ่มโรคทางสุขภาพใจ เช่น โรคซึมเศร้า โรคแพนิค ไบโพลาร์ โรควิตกกังวล โรคเครียด ซึมเศร้าเรื้อรัง นอนไม่หลับ'),
      para('• กลุ่มโรคออฟฟิศซินโดรม เช่น ปวดคอ ปวดไหล่ ปวดหัว ปวดหลัง นิ้วล็อก กายภาพบำบัด'),
      para('• กลุ่มโรคหู คอ จมูก เช่น ไข้ หวัด โควิด 19 ไซนัส'),
      para('• กลุ่มโรคสุขภาพสตรี เช่น ประจำเดือนมาไม่ปกติ ปวดท้องประจำเดือน ตกขาว วัยหมดประจำเดือน'),
      para('• กลุ่มโรคผิวหนัง เช่น ผื่นคัน ผื่นแพ้อากาศ สิว ผด'),
      para('• กลุ่มโรคกระดูกและข้อ'),
      para('• กลุ่มโรคสุขภาพคนทำงาน'),
      para('• กลุ่มโรคหัวใจ'),
      para('• กลุ่มโรคระบบประสาท เช่น ปวดศีรษะ'),
      para('• กลุ่มโรคต่อมไร้ท่อและเมแทบอลิซึม เช่น เบาหวาน ไทรอยด์ โรคอ้วน'),
      para('• กลุ่มโรคผู้สูงอายุ เช่น ปรึกษาเรื่องการใช้ยาเบาหวาน ยาลดไขมัน ยาลดความดันโลหิตสูง'),
      para('• การดูแลประคับประคองตามอาการ'),
      para(
        'นอกจากนี้ยังมีทีมเภสัชกรคอยให้คำแนะนำการใช้ยาหรือสามารถปรึกษาและซื้อยากับเภสัชกรได้เช่นเดียวกับร้านขายยา แต่มั่นใจได้เลยว่าคุณจะได้รับคำแนะนำกับเภสัชกรตัวจริงที่ผ่านตรวจสอบแล้ว',
      ),
      para(
        'สะดวกสบาย ปรึกษาหมอออนไลน์กับ BeDee ตามเวลาที่คุณสะดวก หรือทำนัดล่วงหน้าเพื่อปรึกษาผู้เชี่ยวชาญเฉพาะทาง เพิ่มความยืดหยุ่นในเรื่องเวลา แก้ปัญหาการทำนัดตามโรงพยาบาลทั่วไปที่อาจมีเวลาให้บริการจำกัดแต่มีผู้ป่วยเป็นจำนวนมหาศาล เหมาะสำหรับผู้ที่ไม่มีเวลาไปรอพบแพทย์ที่โรงพยาบาล ผู้ที่ต้องการคำแนะนำจากแพทย์อย่างเร่งด่วน หรือผู้ที่ไม่สามารถเดินทางได้ ช่วยประหยัดเวลาในการเดินทางและลดการสัมผัส',
      ),
      para(
        'BeDee ให้คำปรึกษาทุกวันตั้งแต่เวลา 9.00 – 23.00 น. และจะเปิดให้บริการตลอด 24 ชั่วโมงเร็ว ๆ นี้ สอบถามเพิ่มเติมติดต่อ Line Official : @BeDeebyBDMS',
      ),
      para('BeDee คำนึงถึงบริการที่ได้คุณภาพที่ต้องมาพร้อมราคาที่เอื้อมถึง เพื่อให้ทุกคนเข้าถึงการรักษาที่ได้มาตรฐาน เชื่อถือได้ ช่วยสร้างสังคมสุขภาพดีและรอยยิ้มให้กับคนไทย'),
      para(
        'หลังจากที่ปรึกษาแพทย์ออนไลน์ผ่าน BeDee แล้ว หากแพทย์มีความเห็นว่าผู้ป่วยจำเป็นต้องได้รับการตรวจวินิจฉัยเพิ่มเติมที่โรงพยาบาล BeDee พร้อมเชื่อมต่อการรักษา ส่งต่อผู้ป่วยเพื่อรับการรักษาต่อที่โรงพยาบาลในเครือ BDMS ได้อย่างไร้รอยต่อ สะดวก สบาย',
      ),
      para(
        'เมื่อปรึกษาหมอออนไลน์ผ่านแอป BeDee แล้ว ผู้ป่วยสามารถรับใบรับรองแพทย์ได้ทันที และสามารถนำเอกสารดังกล่าวไปใช้เพื่อเป็นหลักฐานประกอบการเบิกจ่าย หรือการลาได้เช่นเดียวกับใบรับรองแพทย์จากโรงพยาบาล ทั้งนี้โปรดศึกษาเงื่อนไขการเบิกคืนค่ารักษากับประกันหรือหน่วยงานที่ขอเบิกคืนค่ารักษาอีกครั้ง',
      ),
      para('ความปลอดภัยของข้อมูลเป็นสิ่งที่ BeDee ให้ความสำคัญเป็นอย่างสูง แอป BeDee ได้ผ่านการรับรองมาตรฐานสากล ISO 27001 และ ISO 27799'),
      para(
        'ข้อมูลการรักษาและข้อมูลส่วนตัวของผู้ใช้งานถือเป็นความลับสูงสุด ผู้ใช้งานสามารถมั่นใจในเรื่องความปลอดภัย แอป BeDee มีการปกป้องข้อมูลส่วนบุคคลตามข้อกำหนดทางกฎหมาย ซึ่งผู้ใช้งานสามารถเลือกให้ความยินยอมหรือไม่ยินยอมในการเปิดเผยข้อมูลต่าง ๆ และสามารถเปลี่ยนแปลงได้ทุกเมื่อ',
      ),
      heading('h2', 'ขั้นตอนปรึกษาหมอออนไลน์กับ BeDee'),
      para('1. ดาวน์โหลดแอป BeDee ลงทะเบียนผู้ใช้งาน *สามารถเลือกให้ความยินยอมเปิดเผยข้อมูลส่วนบุคคลได้'),
      para('2. เลือกปรึกษาแพทย์ออนไลน์'),
      para('3. ระบุอาการเบื้องต้น'),
      para('4. ชำระค่าปรึกษาแพทย์'),
      para('5. รับคำปรึกษา ชำระค่ายาในกรณีที่แพทย์มีการจ่ายยาและรอรับยาได้เลยที่บ้าน'),
      uploadNode(stepsScreenshot.id),
    ],
  },
}

const richText2 = {
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      heading('h2', 'BeDee ให้บริการโดย BDMS เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย'),
      para('พูดคุยกับแพทย์ ที่ออนไลน์ได้ทันทีเพื่อปรึกษาอาการเฉพาะคุณนัดง่าย ไม่ต้องรอคิว!'),
    ],
  },
}

const existingLayout = page.layout as any[]
const richTextB = existingLayout[2].content
const expertTabs = existingLayout[1]
const articleGrid = existingLayout[3]

await payload.update({
  collection: 'pages',
  id: page.id,
  data: {
    layout: [
      { blockType: 'richTextContent', content: richText1 },
      {
        blockType: 'iconGrid',
        heading: 'ข้อดีของการปรึกษาหมอออนไลน์',
        variant: 'tinted',
        items: [
          { icon: iconDoctors.id, label: 'ทีมแพทย์และผู้เชี่ยวชาญจาก BDMS' },
          { icon: iconFlexibleTime.id, label: 'เลือกเวลาที่คุณสะดวก' },
          { icon: icon247.id, label: 'ให้บริการ 24/7' },
          { icon: iconPrice.id, label: 'ราคามาตรฐาน' },
          { icon: iconReferral.id, label: 'ส่งต่อการรักษา' },
          { icon: iconCertificate.id, label: 'รับใบรับรองแพทย์และใบเสร็จได้ทันที' },
        ],
      },
      { blockType: 'richTextContent', content: richText2 },
      expertTabs,
      { blockType: 'richTextContent', content: richTextB },
      articleGrid,
    ],
  },
  overrideAccess: true,
})

console.log('Uploaded 7 images and rebuilt page', page.id, 'with 6 layout blocks')
process.exit(0)
