import React from 'react'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

// Self-hosted at build time — no runtime dependency on fonts.googleapis.com
// or fonts.gstatic.com (the CSS `@import` this replaced was subject to
// Google's per-User-Agent content negotiation, which could hand out a
// gstatic file hash that 404s for a given browser).
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
})

export const metadata = {
  metadataBase: new URL('https://bedee-payload.vercel.app'),
  title: 'BeDee — แพลตฟอร์มให้บริการด้านสุขภาพ',
  description: 'ปรึกษาหมอออนไลน์ ปรึกษาเภสัชกร ส่งยา — Powered by BDMS',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body>{children}</body>
    </html>
  )
}
