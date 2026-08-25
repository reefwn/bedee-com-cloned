'use client'

import { useEffect, useId, useMemo, useState, type MouseEvent } from 'react'

type FAQIndexItem = { question: string; answer: string; steps?: string[] | null }
type FAQIndexCategory = { name: string; items: FAQIndexItem[] }
type PriorityQuestion = { label: string; categoryIndex: number; itemIndex: number }
type QuickLink = { label: string; url: string }

const FOCUS_RING = 'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]'

function itemId(categoryIndex: number, itemIndex: number) {
  return `faq-${categoryIndex}-${itemIndex}`
}

// The FAQPage schema text for a step item must match what's actually
// rendered (a numbered list), not the plain-prose `answer` it was split
// from — otherwise visible content and structured data diverge.
function answerText(item: FAQIndexItem) {
  return item.steps?.length ? item.steps.map((step, i) => `${i + 1}. ${step}`).join(' ') : item.answer
}

// Matches ExpertTabs' local convention (no shared hook in this codebase).
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
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const searchId = useId()
  const normalizedQuery = query.trim().toLowerCase()
  const prefersReducedMotion = usePrefersReducedMotion()

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: categories.flatMap((cat) =>
        cat.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: answerText(item) },
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
          answerText(item).toLowerCase().includes(normalizedQuery),
      ),
  }))
  const hasResults = filteredCategories.some((cat) => cat.items.length > 0)

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // A hard jump reads as broken teleportation on a long list page — smooth
    // scroll makes the destination legible as "we moved you", not a cut.
    el.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  // Direct loads/back-forward with a #faq-x-y hash still need to open +
  // scroll to the target — a plain anchor scrolls but never opens a closed
  // item on its own.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1)
      if (!id) return
      if (id.startsWith('faq-')) setOpenIds((prev) => new Set(prev).add(id))
      requestAnimationFrame(() => scrollToId(id))
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion])

  // In-page jump links (priority list, category nav, the insurance quick
  // link): intercept so the scroll can be smooth and, for question links,
  // the target opens before we scroll to it — the default click already
  // jumps instantly and never opens a closed item.
  const handleJumpClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    if (id.startsWith('faq-')) setOpenIds((prev) => new Set(prev).add(id))
    window.history.pushState(null, '', `#${id}`)
    requestAnimationFrame(() => scrollToId(id))
  }

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
          {quickLinks.map((link, i) => {
            const anchorId = link.url.startsWith('#') ? link.url.slice(1) : null
            return (
              <a
                key={i}
                href={link.url}
                onClick={anchorId ? (e) => handleJumpClick(e, anchorId) : undefined}
                className={`rounded-pill bg-panel-1 px-4 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 ${FOCUS_RING}`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>
      )}

      {priorityQuestions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[28px] font-semibold text-primary">คำถามที่พบบ่อยที่สุด</h2>
          <ol className="mt-2 divide-y divide-panel-2">
            {priorityQuestions.map((q, i) => {
              const id = itemId(q.categoryIndex, q.itemIndex)
              return (
                <li key={i}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleJumpClick(e, id)}
                    className={`flex items-baseline gap-4 py-3 text-ink hover:text-secondary ${FOCUS_RING}`}
                  >
                    <span className="w-6 flex-none text-sm text-muted">{i + 1}</span>
                    <span className="font-medium">{q.label}</span>
                  </a>
                </li>
              )
            })}
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
              onClick={(e) => handleJumpClick(e, `cat-${ci}`)}
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
              <h2 className="text-[28px] font-semibold text-primary">{cat.name}</h2>
              <div className="mt-4 divide-y divide-panel-2">
                {cat.items.map((item) => {
                  const id = itemId(cat.ci, item.ii)
                  const isOpen = openIds.has(id)
                  return (
                    <div key={item.ii} id={id} className="scroll-mt-24 py-4">
                      {/* AI SEO + WAI-ARIA disclosure pattern: the heading
                          wraps the trigger button (button can't legally
                          contain a heading) so the question is real document
                          structure — crawlable outline, not just button
                          label text. */}
                      <h3 className="m-0 font-medium text-ink">
                        <button
                          type="button"
                          id={`${id}-trigger`}
                          aria-expanded={isOpen}
                          aria-controls={`${id}-panel`}
                          onClick={() =>
                            setOpenIds((prev) => {
                              const next = new Set(prev)
                              next.has(id) ? next.delete(id) : next.add(id)
                              return next
                            })
                          }
                          className={`flex w-full cursor-pointer items-center justify-between gap-4 text-left ${FOCUS_RING}`}
                        >
                          <span>{item.question}</span>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`h-5 w-5 flex-none text-secondary transition-transform ease-out-strong ${
                              prefersReducedMotion ? 'duration-0' : 'duration-[220ms]'
                            } ${isOpen ? 'rotate-180' : ''}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </h3>
                      {/* grid-template-rows 0fr->1fr animates to an intrinsic
                          (not pre-measured) height — the standard zero-JS way
                          to transition height:auto content. */}
                      <div
                        id={`${id}-panel`}
                        role="region"
                        aria-labelledby={`${id}-trigger`}
                        className={`grid transition-[grid-template-rows] ease-out-strong ${
                          prefersReducedMotion ? 'duration-0' : 'duration-[280ms]'
                        }`}
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          {item.steps?.length ? (
                            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-muted">
                              {item.steps.map((step, si) => (
                                <li key={si}>{step}</li>
                              ))}
                            </ol>
                          ) : (
                            <p className="pt-3 leading-7 text-muted">{item.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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
