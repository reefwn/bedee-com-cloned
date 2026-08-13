'use client'

import { useState } from 'react'
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS, INTEREST_OPTIONS } from '@/collections/CorporateInquiries'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full border border-panel-2 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]'

export function CorporateInquiryForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)
    const interests = data.getAll('interests')

    try {
      const res = await fetch('/api/corporate-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.get('fullName'),
          companyName: data.get('companyName'),
          email: data.get('email'),
          position: data.get('position'),
          phone: data.get('phone'),
          industry: data.get('industry'),
          companySize: data.get('companySize'),
          interests,
          message: data.get('message'),
          honeypot: data.get('honeypot'),
        }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white px-6 py-8 text-center">
        <p className="font-semibold text-primary">ส่งข้อมูลสำเร็จ</p>
        <p className="mt-2 text-sm text-muted">ขอบคุณที่สนใจ BeDee ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input name="fullName" required placeholder="ชื่อ-นามสกุล" className={inputClass} />
      <input name="companyName" required placeholder="ชื่อบริษัท" className={inputClass} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="email" name="email" required placeholder="อีเมลบริษัท" className={inputClass} />
        <input name="position" required placeholder="ตำแหน่ง" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="tel" name="phone" required placeholder="เบอร์ติดต่อ" className={inputClass} />
        <select name="industry" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            โปรดเลือกประเภทธุรกิจ
          </option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted">จำนวนพนักงาน</label>
        <select name="companySize" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            โปรดเลือกจำนวนพนักงาน
          </option>
          {COMPANY_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted">หัวข้อการดูแลสุขภาพที่คุณสนใจ (เลือกได้มากกว่า 1 ข้อ)</label>
        <div className="grid gap-2 border border-panel-2 bg-white px-4 py-3 sm:grid-cols-2">
          {INTEREST_OPTIONS.map((option) => (
            <label key={option} className="flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" name="interests" value={option} className="mt-1" />
              {option}
            </label>
          ))}
        </div>
      </div>
      <textarea name="message" rows={4} placeholder="รายละเอียดเพิ่มเติม ถ้ามีกรุณาระบุ" className={inputClass} />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
      >
        {status === 'submitting' ? 'กำลังส่ง...' : 'Submit'}
      </button>
      {status === 'error' && <p className="text-sm text-accent">ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>}
    </form>
  )
}
