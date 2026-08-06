'use client'

import Image from 'next/image'
import { useState } from 'react'

type Doctor = {
  id: string
  name: string
  role: 'doctor' | 'pharmacist'
  specialty?: string | null
  photo: { url?: string | null }
}

// Section 5 of plans/04-final-prompt.md §3 — state machine: instant dataset swap,
// NO crossfade (source has none). Data logic: filter by `role`, not two separate widgets.
export function ExpertTabs({ heading, doctors }: { heading?: string | null; doctors: Doctor[] }) {
  const [role, setRole] = useState<'doctor' | 'pharmacist'>('doctor')
  const visible = doctors?.filter((d) => d.role === role) ?? []

  return (
    <section id="next" className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && <h2 className="text-[28px] font-semibold text-primary">{heading}</h2>}
        <div className="mt-6 flex justify-center gap-8">
          <button
            onClick={() => setRole('doctor')}
            className={`focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${role === 'doctor' ? 'font-semibold text-secondary' : 'text-ink'}`}
          >
            แพทย์ในเครือ
          </button>
          <button
            onClick={() => setRole('pharmacist')}
            className={`focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${role === 'pharmacist' ? 'font-semibold text-secondary' : 'text-ink'}`}
          >
            เภสัชกรในเครือ
          </button>
        </div>
        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-muted">
            {role === 'doctor' ? 'กำลังปรับปรุงข้อมูลแพทย์ในเครือ' : 'กำลังปรับปรุงข้อมูลเภสัชกรในเครือ'}
          </p>
        ) : (
        <div className="mt-8 flex gap-6 overflow-x-auto">
          {visible.map((d) => (
            <div key={d.id} className="w-32 shrink-0 text-center">
              {d.photo?.url && (
                <Image
                  src={d.photo.url}
                  alt={d.name}
                  width={120}
                  height={120}
                  className="mx-auto rounded-full object-cover"
                />
              )}
              <p className="mt-2 text-sm font-medium">{d.name}</p>
              {d.specialty && <p className="text-xs text-muted">{d.specialty}</p>}
            </div>
          ))}
        </div>
        )}
        <a
          href="#"
          className="mt-8 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
        >
          ดูทั้งหมด ›
        </a>
      </div>
    </section>
  )
}
