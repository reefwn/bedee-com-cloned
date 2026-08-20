import Image from 'next/image'

// From revise-website.pptx slide 3 (image30.png, full-res) — "INSURANCE MADE
// EASIER". A single-row gradient banner — the one other real section on
// this site (besides the hero) that uses the navy->blue gradient, so this
// reuses that exact token rather than introducing a new color decision.
// Decorative circle reuses the same accent-blob motif as the hero and the
// dark FeatureSteps variant.
export function PromoStrip({
  icon,
  kicker,
  heading,
  body,
  ctaLabel,
  ctaUrl,
}: {
  icon?: { url?: string | null; alt?: string | null } | null
  kicker?: string | null
  heading: string
  body?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}) {
  const safeUrl = (url?: string | null) =>
    url && /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : undefined

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex flex-1 flex-col items-center gap-6 text-center md:flex-row md:items-center md:text-left">
          {icon?.url && (
            <Image
              src={icon.url}
              alt={icon.alt || ''}
              width={72}
              height={72}
              className="h-16 w-16 flex-none object-contain md:h-[72px] md:w-[72px]"
            />
          )}
          <div>
            {kicker && (
              <p className="text-sm font-semibold tracking-wide text-white/80">{kicker}</p>
            )}
            <h2 className="mt-1 whitespace-pre-line text-2xl font-semibold leading-tight text-white md:text-3xl">
              {heading}
            </h2>
            {body && <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">{body}</p>}
          </div>
        </div>
        {ctaLabel && safeUrl(ctaUrl) && (
          <a
            href={safeUrl(ctaUrl)}
            className="inline-block flex-none rounded-pill bg-white px-6 py-3 text-[15px] font-medium text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(255,255,255,0.5)]"
          >
            {ctaLabel} ↗
          </a>
        )}
      </div>
    </section>
  )
}
