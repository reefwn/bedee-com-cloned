'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full border border-panel-2 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          subject: data.get('subject'),
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
      <div className="bg-panel-1 px-6 py-8 text-center">
        <p className="font-semibold text-primary">ส่งข้อความสำเร็จ</p>
        <p className="mt-2 text-sm text-muted">ขอบคุณที่ติดต่อเรา ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Hidden from sighted users and screen readers alike — real visitors
          never fill this in, so a non-empty value on submit is a bot. */}
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="firstName" required placeholder="ชื่อ" className={inputClass} />
        <input name="lastName" required placeholder="นามสกุล" className={inputClass} />
      </div>
      <input type="email" name="email" required placeholder="example@example.com" className={inputClass} />
      <input name="subject" placeholder="หัวข้อ" className={inputClass} />
      <textarea name="message" required rows={5} placeholder="เขียนข้อความถึงเรา" className={inputClass} />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
      >
        {status === 'submitting' ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-accent">ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>
      )}
    </form>
  )
}
