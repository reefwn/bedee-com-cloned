import Image from 'next/image'

type Promotion = {
  id: string
  title: string
  banner: { url?: string | null; alt?: string | null }
  ctaUrl?: string | null
}

// Same card language as ArticleGrid (square corners, flat, image + title) —
// the Two-Shape Rule applies to promotions the same as article content.
export function PromotionGrid({
  heading,
  promotions,
}: {
  heading?: string | null
  promotions: Promotion[]
}) {
  if (!promotions?.length) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && <h2 className="text-[28px] font-semibold text-primary">{heading}</h2>}
        <div className="mt-8 grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <a
              key={promo.id}
              href={promo.ctaUrl || '#'}
              target={promo.ctaUrl ? '_blank' : undefined}
              rel={promo.ctaUrl ? 'noopener noreferrer' : undefined}
              className="block focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {promo.banner?.url && (
                  <Image
                    src={promo.banner.url}
                    alt={promo.banner.alt || promo.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h3 className="mt-3 line-clamp-2 font-bold text-primary">{promo.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
