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

// No source design — real content instead: Compliment for Customer Survey.xlsx
// (genuine customer-survey free text, names already pre-redacted by the
// source system). Quote glyph reuses the system's flat, single-color,
// no-shadow vocabulary rather than inventing a new decorative device.
// Cards use items-start so varying quote lengths don't force equal height —
// no line-clamp either, since AI search needs to be able to read the full
// real quote, not a truncated fragment.
export function TestimonialGrid({
  kicker,
  heading,
  testimonials,
}: {
  kicker?: string | null
  heading: string
  testimonials: Testimonial[]
}) {
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
        <div className="mt-10 grid grid-cols-1 items-start gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="bg-panel-1 p-6">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-secondary/30"
              >
                <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H4.83c0-1.31 1.06-2.34 2.34-2.34V6Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83h-4c0-1.31 1.06-2.34 2.34-2.34V6Z" />
              </svg>
              <blockquote className="mt-4 text-sm leading-relaxed text-ink">
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
      </div>
    </section>
  )
}
