import Image from 'next/image'

// Section 6 of plans/04-final-prompt.md §3 — background #F4F7FC, centered column.
export function PromoBanner({
  heading,
  body,
  image,
  badgeLabel,
  ctaLabel,
  ctaUrl,
}: {
  heading?: string | null
  body?: string | null
  image?: { url?: string | null; alt?: string | null } | null
  badgeLabel?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}) {
  return (
    <section className="bg-panel-2 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center md:flex-row md:text-left">
        {image?.url && (
          <div className="flex-1">
            <Image
              src={image.url}
              alt={image.alt || ''}
              width={640}
              height={654}
              className="max-h-[420px] w-full object-contain"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-2 text-3xl font-semibold text-primary">
          <span>{heading}</span>
          {badgeLabel && (
            <span className="rounded-full bg-white px-2 py-1 text-xs">{badgeLabel}</span>
          )}
          </div>
          {body && <p className="max-w-xl text-base leading-7 text-ink">{body}</p>}
          {ctaLabel && ctaUrl && (
            <a href={ctaUrl} className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white">
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
