'use client'

import { useEffect, useId, useMemo, useState } from 'react'

type FAQIndexItem = { question: string; answer: string }
type FAQIndexCategory = { name: string; items: FAQIndexItem[] }
type PriorityQuestion = { label: string; categoryIndex: number; itemIndex: number }
type QuickLink = { label: string; url: string }

const FOCUS_RING = 'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]'

function itemId(categoryIndex: number, itemIndex: number) {
  return `faq-${categoryIndex}-${itemIndex}`
}

// AI SEO: FAQPage schema is built from the same `categories` data the page
// renders below — visible content and structured data never diverge. The
// curated `priorityQuestions` strip is a navigation aid (anchors into the
// full list), not a second copy of the content, so it stays out of the
// schema to avoid duplicate mainEntity entries.
export function FAQIndex({
  heading,
  intro,
  updatedAt,
  safetyNotice,
  quickLinks,
  priorityQuestions,
  categories,
}: {
  heading: string
  intro?: string | null
  updatedAt?: string | null
  safetyNotice?: string | null
  quickLinks: QuickLink[]
  priorityQuestions: PriorityQuestion[]
  categories: FAQIndexCategory[]
}) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const normalizedQuery = query.trim().toLowerCase()

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: categories.flatMap((cat) =>
        cat.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      ),
    }),
    [categories],
  )

  const filteredCategories = categories.map((cat, ci) => ({
    ci,
    name: cat.name,
    items: cat.items
      .map((item, ii) => ({ ...item, ii }))
      .filter(
        (item) =>
          !normalizedQuery ||
          item.question.toLowerCase().includes(normalizedQuery) ||
          item.answer.toLowerCase().includes(normalizedQuery),
      ),
  }))
  const hasResults = filteredCategories.some((cat) => cat.items.length > 0)

  // Plain `<a href="#faq-x-y">` scrolls to the target natively, but browsers
  // don't auto-open a closed <details> just because it's the scroll target —
  // that only happens for the browser's own find-in-page, not fragment nav.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1)
      const el = id && document.getElementById(id)
      if (el instanceof HTMLDetailsElement) {
        el.open = true
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
      }
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      {/* escape `<` so an editor-authored answer containing "</script>" can't break out of this tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <h1 className="text-3xl font-semibold text-primary">{heading}</h1>
      {intro && <p className="mt-4 max-w-3xl leading-7 text-ink">{intro}</p>}
      {updatedAt && (
        <p className="mt-2 text-sm text-muted">
          อัปเดตล่าสุด:{' '}
          {new Date(updatedAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      {safetyNotice && (
        <div className="mt-6 flex gap-3 rounded-lg bg-accent/10 p-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="mt-0.5 h-5 w-5 flex-none text-accent"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            />
          </svg>
          <p className="text-sm leading-6 text-ink">
            <span className="font-semibold text-accent">กรณีฉุกเฉิน — </span>
            {safetyNotice}
          </p>
        </div>
      )}

      {quickLinks?.length > 0 && (
        <nav aria-label="ลิงก์ด่วน" className="mt-6 flex flex-wrap gap-2">
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className={`rounded-pill bg-panel-1 px-4 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 ${FOCUS_RING}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {priorityQuestions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[22px] font-semibold text-primary">คำถามที่พบบ่อยที่สุด</h2>
          <ol className="mt-2 divide-y divide-panel-2">
            {priorityQuestions.map((q, i) => (
              <li key={i}>
                <a
                  href={`#${itemId(q.categoryIndex, q.itemIndex)}`}
                  className={`flex items-baseline gap-4 py-3 text-ink hover:text-secondary ${FOCUS_RING}`}
                >
                  <span className="w-6 flex-none text-sm text-muted">{i + 1}</span>
                  <span className="font-medium">{q.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-10">
        <label htmlFor={searchId} className="sr-only">
          ค้นหาคำถาม
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาคำถาม เช่น ค่าปรึกษา การจัดส่ง ประกัน"
          className={`w-full rounded-pill border border-panel-2 bg-white px-5 py-3 text-ink placeholder:text-muted ${FOCUS_RING}`}
        />
      </div>

      {!normalizedQuery && categories.length > 1 && (
        <nav aria-label="หมวดคำถาม" className="mt-8 flex flex-wrap gap-2 border-t border-panel-2 pt-6">
          {categories.map((cat, ci) => (
            <a
              key={ci}
              href={`#cat-${ci}`}
              className={`rounded-pill bg-panel-2 px-4 py-2 text-sm font-medium text-ink hover:text-secondary ${FOCUS_RING}`}
            >
              {cat.name}
            </a>
          ))}
        </nav>
      )}

      {filteredCategories.map(
        (cat) =>
          cat.items.length > 0 && (
            <div key={cat.ci} id={`cat-${cat.ci}`} className="mt-10 scroll-mt-24">
              <h2 className="text-[22px] font-semibold text-primary">{cat.name}</h2>
              <div className="mt-4 divide-y divide-panel-2">
                {cat.items.map((item) => (
                  <details
                    key={item.ii}
                    id={itemId(cat.ci, item.ii)}
                    className="group scroll-mt-24 py-4"
                  >
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
                    >
                      <span>{item.question}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5 flex-none text-secondary transition-transform duration-150 group-open:rotate-180"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="mt-3 leading-7 text-ink">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ),
      )}

      {!hasResults && (
        <p className="mt-10 text-center text-muted">ไม่พบคำถามที่ตรงกับคำค้นหา &ldquo;{query}&rdquo;</p>
      )}
    </section>
  )
}
