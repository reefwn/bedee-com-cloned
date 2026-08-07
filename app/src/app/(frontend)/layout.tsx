import React from 'react'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://bedee-payload.vercel.app'),
  title: 'BeDee — แพลตฟอร์มให้บริการด้านสุขภาพ',
  description: 'ปรึกษาหมอออนไลน์ ปรึกษาเภสัชกร ส่งยา — Powered by BDMS',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
