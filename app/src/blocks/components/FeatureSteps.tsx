type Item = {
  title: string
  description?: string | null
  linkLabel?: string | null
  linkUrl?: string | null
}

// From revise-website.pptx slide 1 (image4.png) — "ONE APP, COMPLETE CARE".
// Number badges are flat solid circles (DESIGN.md: no gradients outside the
// hero, round = interactive/human) rather than the source's gradient
// squircles — same numbered-step idea, this system's own shape vocabulary.
export function FeatureSteps({
  kicker,
  heading,
  description,
  items,
}: {
  kicker?: string | null
  heading: string
  description?: string | null
  items: Item[]
}) {
  if (!items?.length) return null

  const safeUrl = (url?: string | null) =>
    url && /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : undefined

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {kicker && (
              <p className="text-sm font-semibold tracking-wide text-primary">{kicker}</p>
            )}
            <h2 className="mt-2 whitespace-pre-line text-3xl font-semibold leading-tight text-primary md:text-4xl">
              {heading}
            </h2>
          </div>
          {description && (
            <p className="max-w-sm text-base leading-relaxed text-ink md:text-right">
              {description}
            </p>
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => (
            <div key={i} className="relative overflow-hidden bg-panel-1 p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary/10"
              />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="relative mt-4 text-lg font-semibold leading-snug text-primary">
                {item.title}
              </h3>
              {item.description && (
                <p className="relative mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
              {item.linkLabel && safeUrl(item.linkUrl) && (
                <a
                  href={safeUrl(item.linkUrl)}
                  className="relative mt-4 inline-block text-sm font-medium text-primary hover:opacity-80 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
                >
                  {item.linkLabel} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
