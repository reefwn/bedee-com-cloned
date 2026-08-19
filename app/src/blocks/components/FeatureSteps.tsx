import Image from 'next/image'

type Item = {
  icon: { url?: string | null; alt?: string | null }
  title: string
  description?: string | null
}

// From revise-website.pptx slide 1 (image4.png) — "ONE APP, COMPLETE CARE".
// View/hover only, no CTA — each card carries its own real icon
// (asset-homepage) instead of a step number or a link.
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
            <div
              key={i}
              className="group relative overflow-hidden bg-panel-1 p-6 transition-colors duration-200 ease-out hover:bg-[#EAF1FF]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary/10"
              />
              {item.icon?.url && (
                <Image
                  src={item.icon.url}
                  alt={item.icon.alt || ''}
                  width={56}
                  height={56}
                  className="relative h-14 w-14 object-contain transition-transform duration-200 ease-out group-hover:scale-105"
                />
              )}
              <h3 className="relative mt-4 text-lg font-semibold leading-snug text-primary">
                {item.title}
              </h3>
              {item.description && (
                <p className="relative mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
