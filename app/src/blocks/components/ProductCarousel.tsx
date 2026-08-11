'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Product = {
  id: string
  title: string
  image: { url?: string | null; alt?: string | null }
  price?: number | null
  originalPrice?: number | null
  externalUrl: string
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])
  return reduced
}

// Mirrors the source's real Jet Carousel widget config (data-settings:
// slides_to_show 4/2/2 desktop/tablet/mobile, autoplaySpeed 5000, infinite) —
// but as a native horizontal scroller instead of a transform-based slider, so
// the visible-count-per-breakpoint doesn't need to be tracked in JS. Dots are
// skipped (unlike the source) since 40 products would mean 40 dots.
export function ProductCarousel({
  heading,
  icon,
  products,
}: {
  heading?: string | null
  icon?: { url?: string | null; alt?: string | null } | null
  products: Product[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (products.length < 2 || prefersReducedMotion || autoplayStopped || hovered) return
    const timer = window.setInterval(() => {
      const track = trackRef.current
      if (!track) return
      const card = track.querySelector('[data-card]') as HTMLElement | null
      const step = card ? card.offsetWidth + 16 : track.clientWidth
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' })
    }, 5_000)
    return () => window.clearInterval(timer)
  }, [products.length, prefersReducedMotion, autoplayStopped, hovered])

  if (!products?.length) return null

  const scrollByCard = (dir: 1 | -1) => {
    setAutoplayStopped(true)
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-card]') as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : track.clientWidth
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {heading && (
        <h2 className="mb-6 flex items-center gap-2 text-[28px] font-semibold text-primary">
          {icon?.url && (
            <Image src={icon.url} alt="" width={32} height={40} className="h-10 w-8 object-contain" />
          )}
          {heading}
        </h2>
      )}
      <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <a
              key={product.id}
              data-card
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[46%] shrink-0 snap-start focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] sm:w-[31%] lg:w-[23%]"
            >
              <div className="relative aspect-square overflow-hidden bg-panel-1">
                {product.image?.url && (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt || product.title}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
                    className="object-contain p-4"
                  />
                )}
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-medium text-ink">{product.title}</p>
              {typeof product.price === 'number' && (
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-semibold text-primary">฿{product.price.toLocaleString('th-TH')}</span>
                  {typeof product.originalPrice === 'number' && (
                    <span className="text-sm text-muted line-through">
                      ฿{product.originalPrice.toLocaleString('th-TH')}
                    </span>
                  )}
                </p>
              )}
            </a>
          ))}
        </div>
        <button
          aria-label="ก่อนหน้า"
          onClick={() => scrollByCard(-1)}
          className="arrow-hover absolute left-0 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] md:block"
        >
          ‹
        </button>
        <button
          aria-label="ถัดไป"
          onClick={() => scrollByCard(1)}
          className="arrow-hover absolute right-0 top-[38%] hidden translate-x-1/2 -translate-y-1/2 text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] md:block"
        >
          ›
        </button>
      </div>
    </div>
  )
}
