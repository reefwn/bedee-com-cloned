import Image from 'next/image'

type Item = {
  title: string
  description?: string | null
}

// From revise-website.pptx slide 2 (image20.png, full-res) — "CARE YOU CAN
// TRUST" — and slide 3 (image29.png) — "ยาครบ จบในครั้งเดียว". A real photo
// (not a cutout) gets the same soft-rounded treatment as the hero's earlier
// boxed-photo iteration, since this section isn't full-bleed — plus a
// floating credential badge, the one other place besides the hero that has
// real evidence of a shadowed overlay (see DESIGN.md's persistent-overlay
// shadow exception). Steps are a real <ol> — order is meaningful (choose →
// consult → continue care), unlike the icon-grid sections' unordered
// feature sets. ctaVariant differs between the two real instances: "CARE
// YOU CAN TRUST" ships one outline CTA; the telepharmacy instance pairs a
// solid primary CTA with a plain-text secondary link.
export function TrustChecklist({
  kicker,
  heading,
  body,
  image,
  imageBadgeLabel,
  imageBadgeSub,
  items,
  ctaVariant = 'outline',
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: {
  kicker?: string | null
  heading: string
  body?: string | null
  image: { url?: string | null; alt?: string | null }
  imageBadgeLabel?: string | null
  imageBadgeSub?: string | null
  items: Item[]
  ctaVariant?: 'outline' | 'solid' | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaUrl?: string | null
}) {
  const safeUrl = (url?: string | null) =>
    url && /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : undefined
  const isSolid = ctaVariant === 'solid'

  return (
    <section className="bg-panel-1 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-center md:px-12">
        <div className="relative flex-1">
          {image?.url && (
            <Image
              src={image.url}
              alt={image.alt || heading}
              width={900}
              height={600}
              className="w-full rounded-[28px] object-cover"
            />
          )}
          {imageBadgeLabel && (
            <div className="absolute bottom-4 right-4 max-w-[240px] rounded-2xl bg-white p-4 shadow-lg sm:bottom-6 sm:right-6">
              <p className="text-sm font-semibold text-primary">{imageBadgeLabel}</p>
              {imageBadgeSub && <p className="mt-1 text-xs text-muted">{imageBadgeSub}</p>}
            </div>
          )}
        </div>
        <div className="flex-1">
          {kicker && <p className="text-sm font-semibold tracking-wide text-primary">{kicker}</p>}
          <h2 className="mt-2 whitespace-pre-line text-3xl font-semibold leading-tight text-primary md:text-4xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-base leading-relaxed text-ink">{body}</p>}
          {items?.length > 0 && (
            <ol className="mt-6 flex flex-col gap-5">
              {items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-panel-2 text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-semibold text-primary">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {(ctaLabel && safeUrl(ctaUrl)) || (secondaryCtaLabel && safeUrl(secondaryCtaUrl)) ? (
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {ctaLabel && safeUrl(ctaUrl) && (
                <a
                  href={safeUrl(ctaUrl)}
                  className={`inline-block rounded-pill px-6 py-3 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                    isSolid
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'border border-primary text-primary hover:bg-primary/5'
                  }`}
                >
                  {ctaLabel} ↗
                </a>
              )}
              {secondaryCtaLabel && safeUrl(secondaryCtaUrl) && (
                <a
                  href={safeUrl(secondaryCtaUrl)}
                  className="border-b-2 border-primary pb-0.5 text-[15px] font-semibold text-primary focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
                >
                  {secondaryCtaLabel}
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
