'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Role = 'doctor' | 'specialist' | 'pharmacist'

type Doctor = {
  id: string
  name: string
  role: Role
  specialty?: string | null
  photo: { url?: string | null }
}

const TAB_LABEL: Record<Role, string> = {
  doctor: 'แพทย์ในเครือ',
  specialist: 'ผู้เชี่ยวชาญในเครือ',
  pharmacist: 'เภสัชกรในเครือ',
}
const EMPTY_MESSAGE: Record<Role, string> = {
  doctor: 'กำลังปรับปรุงข้อมูลแพทย์ในเครือ',
  specialist: 'กำลังปรับปรุงข้อมูลผู้เชี่ยวชาญในเครือ',
  pharmacist: 'กำลังปรับปรุงข้อมูลเภสัชกรในเครือ',
}
const SEE_ALL_HREF: Record<Role, string> = {
  doctor: '/teleconsultation',
  specialist: '/teleconsultation',
  pharmacist: '/telepharmacy',
}

// Matches TestimonialGrid/ImageCarousel/ProductGallery's shared convention.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])
  return reduced
}

// Cards-per-page needs to be known in JS to build the `pages` array, so it's
// read via matchMedia (same breakpoints TestimonialGrid uses) rather than
// left to CSS grid alone.
function useColumns() {
  const [columns, setColumns] = useState(5)
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')
    const update = () => setColumns(lg.matches ? 5 : sm.matches ? 3 : 2)
    update()
    lg.addEventListener('change', update)
    sm.addEventListener('change', update)
    return () => {
      lg.removeEventListener('change', update)
      sm.removeEventListener('change', update)
    }
  }, [])
  return columns
}

const GRID_COLS_CLASS: Record<number, string> = { 5: 'grid-cols-5', 3: 'grid-cols-3', 2: 'grid-cols-2' }

// Section 5 of plans/04-final-prompt.md §3 — state machine: instant dataset swap,
// NO crossfade (source has none). Data logic: filter by `role`, not two separate widgets.
export function ExpertTabs({ heading, doctors }: { heading?: string | null; doctors: Doctor[] }) {
  const [role, setRole] = useState<Role>('doctor')
  const columns = useColumns()
  const [page, setPage] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const visible = doctors?.filter((d) => d.role === role) ?? []

  useEffect(() => {
    setPage(0)
  }, [role, columns])

  const pages: Doctor[][] = []
  for (let i = 0; i < visible.length; i += columns) {
    pages.push(visible.slice(i, i + columns))
  }
  const pageCount = pages.length
  const goTo = (i: number) => setPage((i + pageCount) % pageCount)

  return (
    <section id="next" className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && <h2 className="text-[28px] font-semibold text-primary">{heading}</h2>}
        <div className="mt-6 flex justify-center gap-8">
          {(['doctor', 'specialist', 'pharmacist'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${role === r ? 'font-semibold text-secondary' : 'text-ink'}`}
            >
              {TAB_LABEL[r]}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-muted">{EMPTY_MESSAGE[role]}</p>
        ) : (
        <div className="relative mt-8">
          <div className="overflow-hidden">
            <div
              className={`flex ${prefersReducedMotion ? '' : '[transition:transform_500ms_var(--ease-out)]'}`}
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {pages.map((pageItems, p) => (
                <div
                  key={p}
                  className={`grid w-full shrink-0 gap-6 px-7 md:px-9 ${GRID_COLS_CLASS[columns]}`}
                >
                  {pageItems.map((d) => (
                    <div key={d.id} className="text-center">
                      {d.photo?.url && (
                        // Fixed-size wrapper + overflow-hidden + fill is what actually
                        // guarantees a circle: width/height props on <Image> alone are
                        // only intrinsic-size hints — without a pinned box, height
                        // followed each source photo's own aspect ratio, so
                        // rounded-full rendered an ellipse for any non-square photo.
                        <div className="relative mx-auto h-[120px] w-[120px] overflow-hidden rounded-full">
                          <Image
                            src={d.photo.url}
                            alt={d.name}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="mt-2 text-sm font-medium">{d.name}</p>
                      {d.specialty && <p className="text-xs text-muted">{d.specialty}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {pageCount > 1 && (
            <>
              <button
                aria-label="ก่อนหน้า"
                onClick={() => goTo(page - 1)}
                className="arrow-hover absolute left-0 top-1/2 flex h-10 w-7 -translate-y-1/2 items-center justify-center text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] md:w-9"
              >
                ‹
              </button>
              <button
                aria-label="ถัดไป"
                onClick={() => goTo(page + 1)}
                className="arrow-hover absolute right-0 top-1/2 flex h-10 w-7 -translate-y-1/2 items-center justify-center text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] md:w-9"
              >
                ›
              </button>
            </>
          )}
        </div>
        )}
        {visible.length > 0 && pageCount > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                aria-label={`ไปที่หน้า ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition-opacity focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                  i === page ? 'bg-primary' : 'bg-panel-2'
                }`}
              />
            ))}
          </div>
        )}
        {/* "See all" has no dedicated doctor-directory page yet — route to
            the matching service page, a real destination, instead of "#" */}
        <a
          href={SEE_ALL_HREF[role]}
          className="mt-8 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
        >
          ดูทั้งหมด ›
        </a>
      </div>
    </section>
  )
}
