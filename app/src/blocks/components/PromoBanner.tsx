// Section 6 of plans/04-final-prompt.md §3 — background #F4F7FC, centered column.
export function PromoBanner({
  heading,
  badgeLabel,
  ctaLabel,
  ctaUrl,
}: {
  heading?: string | null
  badgeLabel?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}) {
  return (
    <section className="bg-panel-2 py-16 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-semibold text-primary">
          <span>📦</span>
          <span>{heading}</span>
          {badgeLabel && (
            <span className="rounded-full bg-white px-2 py-1 text-xs">{badgeLabel}</span>
          )}
        </div>
        {ctaLabel && ctaUrl && (
          <a href={ctaUrl} className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white">
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
