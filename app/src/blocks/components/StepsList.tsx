import Image from 'next/image'

type Item = {
  title: string
  description?: string | null
}

// From revise-website.pptx slide 4 (image32/33.png, full-res) — "HOW IT
// WORKS". A third distinct list treatment on this site (after
// TrustChecklist's numbered <ol> and FeatureSteps' icon cards): plain
// hairline-divided rows, muted digit instead of a badge. Real <ol> — the 5
// steps are sequential (download → search → choose → book → consult).
// image34.png already has the site's accent-blob motif composited in, so
// no decorative circle is added here.
export function StepsList({
  kicker,
  heading,
  body,
  image,
  items,
}: {
  kicker?: string | null
  heading: string
  body?: string | null
  image?: { url?: string | null; alt?: string | null } | null
  items: Item[]
}) {
  if (!items?.length) return null

  return (
    <section className="bg-panel-1 py-16">
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
          {body && (
            <p className="max-w-sm text-base leading-relaxed text-ink md:text-right">{body}</p>
          )}
        </div>
        <div className="mt-10 flex flex-col gap-12 md:flex-row md:items-center">
          <ol className="flex-1 divide-y divide-primary/10 border-t border-primary/10">
            {items.map((item, i) => (
              <li key={i} className="flex gap-6 py-5">
                <span className="w-8 flex-none text-sm font-semibold text-muted">
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
          {image?.url && (
            <div className="relative flex-1">
              <Image
                src={image.url}
                alt={image.alt || heading}
                width={640}
                height={640}
                className="mx-auto w-full max-w-[420px] object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
