import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ContactForm } from '@/components/ContactForm'

export const dynamic = 'force-dynamic'

const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=%E0%B8%A3%E0%B8%9E.%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%94%E0%B8%B8%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%81%E0%B8%B2%E0%B8%A3&t=m&z=18&output=embed&iwloc=near'

function LocationIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="20" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6099 30.2506C22.5574 28.3843 28.5 22.357 28.5 18.2954C28.5 13.4378 24.6944 9.5 20 9.5C15.3056 9.5 11.5 13.4378 11.5 18.2954C11.5 22.357 17.4426 28.3843 19.3901 30.2506C19.7372 30.5831 20.2628 30.5831 20.6099 30.2506ZM20 22.0995C22.0864 22.0995 23.7778 20.3638 23.7778 18.2227C23.7778 16.0816 22.0864 14.346 20 14.346C17.9136 14.346 16.2222 16.0816 16.2222 18.2227C16.2222 20.3638 17.9136 22.0995 20 22.0995Z"
        stroke="#4B88F8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="20" fill="white" />
      <path
        d="M11.5858 11.5858C11.2107 11.9609 11 12.4696 11 13V14C11 22.284 17.716 29 26 29H27C27.5304 29 28.0391 28.7893 28.4142 28.4142C28.7893 28.0391 29 27.5304 29 27V23.721C29.0001 23.511 28.934 23.3064 28.8112 23.136C28.6885 22.9657 28.5152 22.8383 28.316 22.772L23.823 21.274C23.5947 21.1981 23.3466 21.2071 23.1244 21.2993C22.9021 21.3915 22.7205 21.5607 22.613 21.776L21.483 24.033C19.0345 22.9267 17.0733 20.9655 15.967 18.517L18.224 17.387C18.4393 17.2795 18.6085 17.0979 18.7007 16.8756C18.7929 16.6534 18.8019 16.4053 18.726 16.177L17.228 11.684C17.1617 11.485 17.0345 11.3118 16.8644 11.189C16.6942 11.0663 16.4898 11.0002 16.28 11H13C12.4696 11 11.9609 11.2107 11.5858 11.5858Z"
        stroke="#4B88F8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="20" fill="white" />
      <path
        d="M11 16L18.89 21.26C19.2187 21.4793 19.6049 21.5963 20 21.5963C20.3951 21.5963 20.7813 21.4793 21.11 21.26L29 16M13 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V15C29 14.4696 28.7893 13.9609 28.4142 13.5858C28.0391 13.2107 27.5304 13 27 13H13C12.4696 13 11.9609 13.2107 11.5858 13.5858C11.2107 13.9609 11 14.4696 11 15V25C11 25.5304 11.2107 26.0391 11.5858 26.4142C11.9609 26.7893 12.4696 27 13 27Z"
        stroke="#4B88F8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="20" fill="white" />
      <path
        d="M20 16V20L23 23M29 20C29 21.1819 28.7672 22.3522 28.3149 23.4442C27.8626 24.5361 27.1997 25.5282 26.364 26.364C25.5282 27.1997 24.5361 27.8626 23.4442 28.3149C22.3522 28.7672 21.1819 29 20 29C18.8181 29 17.6478 28.7672 16.5558 28.3149C15.4639 27.8626 14.4718 27.1997 13.636 26.364C12.8003 25.5282 12.1374 24.5361 11.6851 23.4442C11.2328 22.3522 11 21.1819 11 20C11 17.6131 11.9482 15.3239 13.636 13.636C15.3239 11.9482 17.6131 11 20 11C22.3869 11 24.6761 11.9482 26.364 13.636C28.0518 15.3239 29 17.6131 29 20Z"
        stroke="#4B88F8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'ติดต่อเรา - BeDee',
  description: 'ติดต่อบริษัท เฮลท์ พลาซ่า จำกัด ผู้พัฒนาแอปพลิเคชัน BeDee by BDMS',
  alternates: { canonical: '/contact-us' },
}

export default async function ContactUsPage() {
  const payload = await getPayload({ config })
  const media = await payload.find({
    collection: 'media',
    where: { filename: { equals: 'contact-us-hero.jpg' } },
    limit: 1,
  })
  const hero = media.docs[0]

  return (
    <>
      <SiteHeader />
      <section
        className="relative flex h-[220px] items-center overflow-hidden bg-primary"
        style={
          hero?.url
            ? { backgroundImage: `url(${hero.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,36,88,0.8)' }} />
        <h1 className="relative mx-auto w-full max-w-6xl px-6 text-4xl font-semibold text-white">ติดต่อเรา</h1>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-primary">ส่งข้อความติดต่อ</h2>
            <p className="mt-2 text-muted">สามารถส่งข้อความติดต่อเราได้ตลอดเวลา เราจะติดต่อกลับโดยเร็วที่สุด</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-primary">บริษัท เฮลท์ พลาซ่า จำกัด (สำนักงานใหญ่)</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3">
                <LocationIcon />
                <span className="text-ink">เลขที่ 2/4 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon />
                <a href="tel:+6623103899" className="text-ink hover:text-secondary">
                  0 2310 3899
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EmailIcon />
                <a href="mailto:support@bedee.com" className="text-ink hover:text-secondary">
                  support@bedee.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon />
                <span className="text-ink">จันทร์ – ศุกร์ : 9:00 – 18:00 น.</span>
              </li>
            </ul>
            <div className="mt-6 aspect-video w-full overflow-hidden bg-panel-1">
              <iframe
                src={MAP_EMBED_URL}
                title="รพ.กรุงเทพดุสิตเวชการ"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
