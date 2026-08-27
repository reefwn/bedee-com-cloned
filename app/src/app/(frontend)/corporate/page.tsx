import { cache } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HeroCarousel } from '@/blocks/components/HeroCarousel'
import { LogoStrip } from '@/blocks/components/LogoStrip'
import { CorporateInquiryForm } from '@/components/CorporateInquiryForm'
import { ContactBeDeeButton } from '@/components/ContactBeDeeButton'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'

const MEDIA_FILENAMES = [
  'corporate-hero.png',
  'corporate-ecosystem.png',
  'corporate-mental-health-phones.png',
  'corporate-icon-checkup.png',
  'corporate-icon-network.png',
  'corporate-team.png',
  'corporate-icon-persona.png',
  'corporate-icon-hr.png',
  'corporate-staff-clinic.png',
  'corporate-partners-frame.png',
]

// cache() dedupes this against generateMetadata's identical lookup for the
// same request — same reasoning as the PDP/news [slug] pages' getItem.
const getMedia = cache(async () => {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'media', where: { filename: { in: MEDIA_FILENAMES } }, limit: 20 })
})

const TITLE = 'สำหรับองค์กร - BeDee'
const DESCRIPTION =
  'ดูแลสุขภาพพนักงานอย่างมืออาชีพ ด้วยโปรแกรมประเมินสุขภาพ, Mental Health, Health Checkup และ Staff Clinic จาก BeDee by BDMS'

export async function generateMetadata(): Promise<Metadata> {
  const media = await getMedia()
  const heroUrl = media.docs.find((m) => m.filename === 'corporate-hero.png')?.url

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/corporate' },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'website',
      url: '/corporate',
      images: heroUrl ? [{ url: heroUrl, alt: 'สุขภาพพนักงาน คือหัวใจขององค์กร' }] : undefined,
    },
    twitter: {
      card: heroUrl ? 'summary_large_image' : 'summary',
      title: TITLE,
      description: DESCRIPTION,
      images: heroUrl ? [heroUrl] : undefined,
    },
  }
}

const HEALTH_ACTIVITIES = [
  {
    title: 'Health Assessment',
    description: 'ดูแลสุขภาพพนักงานอย่างมืออาชีพ ด้วยโปรแกรม ประเมินสุขภาพจาก BeDee ที่ช่วยให้องค์กรเข้าใจ สุขภาวะของพนักงาน และดูแลได้ตรงจุด',
  },
  {
    title: 'Health Talk',
    description: 'เสริมความรู้ สร้างความเข้าใจด้านสุขภาพกาย–ใจ ผ่านการบรรยายโดยผู้เชี่ยวชาญจาก BDMS Network เพื่อยกระดับคุณภาพชีวิตของพนักงาน',
  },
  {
    title: 'Health Workshop',
    description: 'เวิร์กช็อปสุขภาพกาย–ใจโดยผู้เชี่ยวชาญ ออกแบบเฉพาะสำหรับแต่ละองค์กร เพื่อเสริมศักยภาพและสร้างความสุขในที่ทำงานอย่างยั่งยืน',
  },
]

const STATS = [
  { value: '6', label: 'โรงพยาบาลชั้นนำ' },
  { value: '58', label: 'ครอบคลุมทั้งพันธมิตรโรงพยาบาลในประเทศไทยและกัมพูชา' },
  { value: '50k+', label: 'พนักงาน รวมถึงแพทย์ พยาบาล บุคลากรทางการแพทย์ และสาขาอื่นๆ' },
]

export default async function CorporatePage() {
  const payload = await getPayload({ config })

  const [media, partners] = await Promise.all([getMedia(), payload.find({ collection: 'partners', limit: 20 })])
  const img = (filename: string) => media.docs.find((m) => m.filename === filename)

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Corporate employee health benefits',
    name: 'BeDee for Corporate',
    description: DESCRIPTION,
    provider: { '@type': 'Organization', name: 'BeDee', url: SITE_URL },
    areaServed: 'TH',
    url: `${SITE_URL}/corporate`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'สำหรับองค์กร', item: `${SITE_URL}/corporate` },
    ],
  }

  const healthCheckupCards = [
    {
      icon: img('corporate-icon-checkup.png'),
      title: 'Health Checkup',
      description: 'ดูแลครบทุกขั้นตอนการตรวจสุขภาพพนักงาน พร้อม Dashboard รายงานผลสำหรับองค์กร',
    },
    {
      icon: img('corporate-icon-network.png'),
      title: 'Personalized Healthcare',
      description: 'รวบรวมผลสุขภาพ พร้อมแนะนำการดูแลสุขภาพที่ออกแบบมาเพื่อองค์กรของคุณโดยเฉพาะ',
    },
    {
      icon: img('corporate-icon-persona.png'),
      title: 'BDMS Network',
      description: 'บริการด้วยมาตรฐานระดับสูง ผ่านเครือข่ายโรงพยาบาล BDMS ที่ครอบคลุมทั่วประเทศ',
    },
    {
      icon: img('corporate-icon-hr.png'),
      title: 'HR Portal',
      description: 'บริหารสุขภาพพนักงานอย่างมีประสิทธิภาพ มองเห็นภาพรวม ประหยัดทั้งเวลาและต้นทุน',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />

      <HeroCarousel
        variant="dark"
        slides={[
          {
            headline: '‘สุขภาพพนักงาน คือหัวใจขององค์กร‘',
            body: 'ความสำเร็จขององค์กรเริ่มต้นจากสุขภาพกายและใจที่ดีของพนักงาน สุดยอดพันธมิตรด้านสุขภาพ พร้อมที่จะปฏิวัติแนวทางการดูแลสุขภาพเพื่อร่วมขับเคลื่อนองค์กรของคุณแล้ว',
            image: { url: img('corporate-hero.png')?.url, alt: 'สุขภาพพนักงาน คือหัวใจขององค์กร' },
            ctaLabel: 'ติดต่อ BeDee',
            ctaUrl: '#contact-us',
          },
        ]}
      />

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-[28px] font-semibold text-primary">
          BeDee by BDMS ผนึกเครือข่ายพันธมิตร เพื่อมอบสุขภาพที่ดีที่สุดให้กับองค์กรของคุณ
        </h2>
        <p className="mt-4 text-muted">
          เชื่อมต่อการรักษาเข้ากับโรงพยาบาลในเครือ พร้อมบริการด้านสุขภาพมากมาย ในด้านยา เวชภัณฑ์ สินค้าสุขภาพ
          และบริการตรวจสุขภาพที่ได้มาตรฐาน
        </p>
        {img('corporate-ecosystem.png')?.url && (
          <Image
            src={img('corporate-ecosystem.png')!.url!}
            alt="Healthcare Ecosystem Platform"
            width={640}
            height={414}
            className="mx-auto mt-8 w-full max-w-2xl"
          />
        )}
      </section>

      <section className="bg-panel-1 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
          {img('corporate-mental-health-phones.png')?.url && (
            <Image
              src={img('corporate-mental-health-phones.png')!.url!}
              alt="BeDee Mental Health บนแอปพลิเคชัน"
              width={666}
              height={585}
              className="mx-auto w-full max-w-md"
            />
          )}
          <div>
            <h2 className="text-[28px] font-semibold text-primary">
              Mental Health <span className="block text-xl">‘สุขภาพใจ’ พนักงานเป็นสิ่งสำคัญ</span>
            </h2>
            <p className="mt-4 text-muted">
              <span className="font-semibold text-ink">BeDee</span> พร้อมดูแลสุขภาพใจให้พนักงานอย่างมืออาชีพ ด้วยโปรแกรม
              Employee Assistance Program (EAP) ที่สะดวก ปลอดภัย และเป็นส่วนตัว ช่วยรับมือกับปัญหาเรื่องงาน
              เพื่อนร่วมงาน เรื่องส่วนตัว ครอบครัว และการติดต่อกับบุคคลภายนอกองค์กร
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <span className="font-semibold text-primary">จิตแพทย์</span>{' '}
                <span className="text-ink">ให้การรักษา ติดตามอาการ และจ่ายยา ผ่านบริการปรึกษาสุขภาพออนไลน์</span>
              </li>
              <li>
                <span className="font-semibold text-primary">นักจิตวิทยา</span>{' '}
                <span className="text-ink">ให้คำปรึกษา พูดคุย แนะนำ และทำจิตบำบัด ผ่านบริการปรึกษาสุขภาพจิตออนไลน์</span>
              </li>
              <li>
                <span className="font-semibold text-primary">พยาบาล</span>{' '}
                <span className="text-ink">ทำแบบประเมินสุขภาพใจเพื่อสำรวจตัวเอง</span>
              </li>
            </ul>
            <p className="mt-4 text-muted">สอบถามแพ็กเกจ Mental Health เพิ่มเติม คลิก</p>
            <ContactBeDeeButton className="mt-4 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]">
              ติดต่อ BeDee
            </ContactBeDeeButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-4xl font-semibold text-primary">Health &amp; Wellness Activity</h2>
        <p className="mt-2 text-xl font-medium text-ink">บริการสุขภาพ จาก BeDee ช่วยดูแลสุขภาพคุณอย่างครบครัน</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {HEALTH_ACTIVITIES.map((activity) => (
            <div key={activity.title}>
              <h3 className="text-xl font-semibold text-primary">{activity.title}</h3>
              <p className="mt-2 text-sm text-muted">{activity.description}</p>
            </div>
          ))}
        </div>
        <ContactBeDeeButton className="mt-10 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]">
          ติดต่อ BeDee
        </ContactBeDeeButton>
      </section>

      <LogoStrip partners={partners.docs as any} />

      <section className="bg-primary py-12 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 text-center sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-[56px] font-semibold leading-none">{stat.value}</p>
              <p className="mt-2 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-panel-1 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-[28px] font-semibold text-primary">Health Checkup</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
            {img('corporate-team.png')?.url && (
              <Image
                src={img('corporate-team.png')!.url!}
                alt="ทีมแพทย์ BeDee by BDMS"
                width={610}
                height={555}
                className="mx-auto w-full max-w-sm"
              />
            )}
            <div className="grid gap-8 sm:grid-cols-2">
              {healthCheckupCards.map((card) => (
                <div key={card.title}>
                  {card.icon?.url && (
                    <Image src={card.icon.url} alt={card.title} width={52} height={52} className="h-12 w-12 object-contain" />
                  )}
                  <h3 className="mt-2 font-semibold text-primary">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Staff Clinic</h2>
            <p className="mt-1 text-muted">คลินิกสุขภาพสำหรับพนักงานในองค์กร</p>
            <p className="mt-4 leading-relaxed text-ink">
              ดูแลสุขภาพของพนักงานตลอด 365 วัน ทุกที่ ทุกเวลา ครอบคลุมการรักษาหลากหลายสาขา ในราคาที่ควบคุมได้ พร้อม
              Dashboard ที่ช่วยให้เห็นภาพรวมทั้งด้านสุขภาพและค่าใช้จ่าย
            </p>
            <p className="mt-3 leading-relaxed text-ink">
              BeDee มีแพ็กเกจดูแลสุขภาพพนักงานหลากหลายรูปแบบ ทั้งองค์กรขนาดเล็ก SME, Startup ไปจนถึงองค์กรขนาดใหญ่
            </p>
          </div>
          {img('corporate-staff-clinic.png')?.url && (
            <Image
              src={img('corporate-staff-clinic.png')!.url!}
              alt="Staff Clinic"
              width={640}
              height={529}
              className="mx-auto w-full max-w-md"
            />
          )}
        </div>
      </section>

      <section className="bg-panel-1 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-[28px] font-semibold text-primary">พาร์ทเนอร์ธุรกิจ</h2>
          <p className="mt-2 text-muted">BeDee ได้รับความไว้วางใจจากองค์กรชั้นนำทั่วประเทศ</p>
          {img('corporate-partners-frame.png')?.url && (
            <Image
              src={img('corporate-partners-frame.png')!.url!}
              alt="องค์กรพันธมิตรของ BeDee"
              width={640}
              height={179}
              className="mx-auto mt-8 w-full max-w-2xl"
            />
          )}
        </div>
      </section>

      <section id="contact-us" className="bg-primary py-16 text-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold">ติดต่อเรา</h2>
            <p className="mt-4 font-semibold">HEALTH PLAZA CO., LTD.</p>
            <p>Business Team</p>
            <a href="mailto:hpz.business@health-plaza.com" className="mt-2 block hover:opacity-80">
              hpz.business@health-plaza.com
            </a>
            <a href="tel:+6623103899" className="block hover:opacity-80">
              0 2310 3899
            </a>
          </div>
          <div className="bg-white p-6">
            <CorporateInquiryForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
