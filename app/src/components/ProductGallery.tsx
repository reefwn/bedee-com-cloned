'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type GalleryImage = { url?: string | null; alt?: string | null }

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

// Same track-transform slide as ImageCarousel.tsx (the site's one other image
// carousel) — a product photo set deserves the same real slide, not a hard
// cut. No autoplay: a product photo set has no reason to auto-advance while
// someone is reading.
export function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  if (!images.length) return null

  const goTo = (i: number) => setIndex((i + images.length) % images.length)

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-panel-1">
        <div
          className={`flex h-full ${prefersReducedMotion ? '' : '[transition:transform_500ms_var(--ease-out)]'}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.alt || title}
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-contain p-6"
                  priority={i === 0}
                />
              )}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              aria-label="ก่อนหน้า"
              onClick={() => goTo(index - 1)}
              className="arrow-hover absolute left-2 top-1/2 -translate-y-1/2 text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              ‹
            </button>
            <button
              aria-label="ถัดไป"
              onClick={() => goTo(index + 1)}
              className="arrow-hover absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-primary transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              ›
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`ไปที่รูปที่ ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-opacity focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                i === index ? 'bg-primary' : 'bg-panel-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
