'use client'

import { useEffect, useState } from 'react'

type Testimonial = {
  authorName: string
  quote: string
  serviceType?: 'delivery' | 'teleconsult' | null
  submittedAt?: string | null
}

const SERVICE_LABEL: Record<string, string> = {
  delivery: 'จัดส่งสินค้า',
  teleconsult: 'ปรึกษาแพทย์/เภสัชกร',
}

// Cards-per-page tracks the same breakpoints as the grid used to (1/2/3
// cols) — paging needs to know the count in JS, so it's read via
// matchMedia rather than left to CSS alone.
function useColumns() {
  const [columns, setColumns] = useState(3)
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')
    const update = () => setColumns(lg.matches ? 3 : sm.matches ? 2 : 1)
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

// No source design — real content instead: Compliment for Customer Survey.xlsx
// (genuine customer-survey free text, names already pre-redacted by the
// source system). Quote glyph reuses the system's flat, single-color,
// no-shadow vocabulary rather than inventing a new decorative device.
// Cards stretch to the tallest one on their page (grid's default
// align-items: stretch + flex-col h-full + figcaption pinned via mt-auto)
// so height stays consistent per page without line-clamping — AI search
// still gets the full real quote, never a truncated fragment.
export function TestimonialGrid({
  kicker,
  heading,
  testimonials,
}: {
  kicker?: string | null
  heading: string
  testimonials: Testimonial[]
}) {
  const columns = useColumns()
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [columns])

  if (!testimonials?.length) return null

  // AI-SEO: real Review structured data — reviewBody is the actual customer
  // quote, no fabricated reviewRating (the source survey's own score column
  // is empty for these responses, so no real rating exists to report).
  const reviewJsonLd = testimonials.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Organization', name: 'BeDee' },
    author: { '@type': 'Person', name: t.authorName },
    reviewBody: t.quote,
    ...(t.submittedAt ? { datePublished: t.submittedAt.slice(0, 10) } : {}),
  }))

  const pageCount = Math.ceil(testimonials.length / columns)
  const start = page * columns
  const visible = testimonials.slice(start, start + columns)
  const goTo = (i: number) => setPage((i + pageCount) % pageCount)
  const gridColsClass = columns === 3 ? 'grid-cols-3' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1'

  return (
    <section className="bg-white py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-6xl px-6 text-center md:px-12">
        {kicker && (
          <p className="text-sm font-semibold tracking-wide text-primary">{kicker}</p>
        )}
        <h2 className="mt-2 text-[28px] font-semibold text-primary">{heading}</h2>
        <div className="relative mt-10">
          {/* px matches the arrow buttons' width below, so the arrows occupy
              their own reserved gutter instead of sitting on top of a card. */}
          <div className={`grid gap-6 px-7 text-left md:px-9 ${gridColsClass}`}>
            {visible.map((t, i) => (
              <figure key={start + i} className="flex h-full flex-col bg-panel-1 p-6">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-8 w-8 flex-none fill-secondary/30"
                >
                  <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H4.83c0-1.31 1.06-2.34 2.34-2.34V6Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83h-4c0-1.31 1.06-2.34 2.34-2.34V6Z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3">
                  <cite className="text-sm font-semibold not-italic text-primary">
                    {t.authorName}
                  </cite>
                  {t.serviceType && (
                    <span className="flex-none text-xs text-muted">
                      {SERVICE_LABEL[t.serviceType] ?? t.serviceType}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
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
        {pageCount > 1 && (
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
      </div>
    </section>
  )
}
