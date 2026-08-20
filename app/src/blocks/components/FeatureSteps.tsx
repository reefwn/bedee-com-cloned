import Image from 'next/image'

type Item = {
  icon: { url?: string | null; alt?: string | null }
  title: string
  description?: string | null
}

// From revise-website.pptx slide 1 (image4.png) — "ONE APP, COMPLETE CARE" —
// and slide 2 (image21.png) — "TELEMEDICINE SERVICE", reusing this same
// view/hover-only, icon-per-card shape with a dark variant rather than a
// second near-duplicate block. No CTA on either variant — no link, no fake
// "+" expand affordance the source screenshot implies but never resolves.
export function FeatureSteps({
  kicker,
  heading,
  description,
  items,
  variant = 'light',
}: {
  kicker?: string | null
  heading: string
  description?: string | null
  items: Item[]
  variant?: 'light' | 'dark' | null
}) {
  if (!items?.length) return null
  const isDark = variant === 'dark'
  // Matches IconGrid's own rule: 6 items balances into a clean 3x2 grid;
  // fewer/other counts fill a single row instead.
  const cols = items.length === 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-5'

  return (
    <section className={isDark ? 'bg-primary py-16' : 'bg-white py-16'}>
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {kicker && (
              <p className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-primary'}`}>
                {kicker}
              </p>
            )}
            <h2
              className={`mt-2 whitespace-pre-line text-3xl font-semibold leading-tight md:text-4xl ${isDark ? 'text-white' : 'text-primary'}`}
            >
              {heading}
            </h2>
          </div>
          {description && (
            <p className={`max-w-sm text-base leading-relaxed md:text-right ${isDark ? 'text-white/80' : 'text-ink'}`}>
              {description}
            </p>
          )}
        </div>
        <ul className={`mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 ${cols}`}>
          {items.map((item, i) => (
            <li
              key={i}
              className={`group relative overflow-hidden p-6 transition-colors duration-200 ease-out ${
                isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-panel-1 hover:bg-[#EAF1FF]'
              }`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${
                  isDark ? 'bg-accent/10' : 'bg-secondary/10'
                }`}
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
              <h3 className={`relative mt-4 text-lg font-semibold leading-snug ${isDark ? 'text-white' : 'text-primary'}`}>
                {item.title}
              </h3>
              {item.description && (
                <p className={`relative mt-2 text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-muted'}`}>
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
