import Image from 'next/image'

// Section 6 of plans/04-final-prompt.md §3 — background #F4F7FC, centered column.
type IconItem = { icon: { url?: string | null; alt?: string | null }; label: string }

export function PromoBanner({
  heading,
  body,
  image,
  badgeLabel,
  ctaLabel,
  ctaUrl,
  subheading,
  iconItems,
}: {
  heading?: string | null
  body?: string | null
  image?: { url?: string | null; alt?: string | null } | null
  badgeLabel?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  subheading?: string | null
  iconItems?: IconItem[] | null
}) {
  return (
    <section className="bg-panel-2 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center md:flex-row md:text-left">
        {image?.url && (
          // Root cause of the invisible image: `flex-1` on a flex-col parent
          // (mobile) sets flex-basis:0% with no explicit container height to
          // grow into, so the wrapper collapses to 0px. `md:flex-1` keeps the
          // even split once flex-row kicks in; below that it's just a block
          // sized by the image's own intrinsic aspect ratio.
          <div className="w-full md:flex-1">
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
          <h2>{heading}</h2>
          {badgeLabel && (
            <span className="rounded-full bg-white px-2 py-1 text-xs">{badgeLabel}</span>
          )}
          </div>
          {body && <p className="max-w-xl text-base leading-7 text-ink">{body}</p>}
          {subheading && <p className="text-lg font-semibold text-secondary">{subheading}</p>}
          {iconItems && iconItems.length > 0 && (
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3">
              {iconItems.map((item, i) => (
                <div key={i}>
                  {item.icon?.url && (
                    <Image
                      src={item.icon.url}
                      alt={item.icon.alt || ''}
                      width={56}
                      height={56}
                      className="mx-auto h-14 w-14 object-contain"
                    />
                  )}
                  <p className="mt-2 text-sm font-medium text-ink">{item.label}</p>
                </div>
              ))}
            </div>
          )}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
