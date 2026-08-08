'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type CarouselImage = { url?: string | null; alt?: string | null }

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

// Mirrors the source's real Elementor Image Carousel widget config, read
// directly off its data-settings attribute: { autoplay_speed: 2000,
// navigation: "both", autoplay: "yes", pause_on_hover: "yes",
// pause_on_interaction: "yes", infinite: "yes", transition: "slide",
// transition_speed: 500 }. "pause_on_interaction: yes" means autoplay stops
// for good the first time someone manually navigates — not paused-then-resumed.
export function ImageCarousel({
  heading,
  images,
}: {
  heading?: string | null
  images: CarouselImage[]
}) {
  const [index, setIndex] = useState(0)
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion || autoplayStopped || hovered) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, 2_000)
    return () => window.clearInterval(timer)
  }, [images.length, prefersReducedMotion, autoplayStopped, hovered])

  if (!images?.length) return null

  const goTo = (i: number) => {
    setAutoplayStopped(true)
    setIndex((i + images.length) % images.length)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {heading ? <h2 className="mb-6 text-2xl font-semibold text-[#081F7C]">{heading}</h2> : null}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          ref={trackRef}
          className={`flex ${prefersReducedMotion ? '' : '[transition:transform_500ms_var(--ease-out)]'}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full shrink-0">
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  width={640}
                  height={640}
                  className="mx-auto h-auto w-full max-w-[500px] object-contain"
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
              className="arrow-hover absolute left-2 top-1/2 -translate-y-1/2 text-3xl text-[#081F7C] transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              ‹
            </button>
            <button
              aria-label="ถัดไป"
              onClick={() => goTo(index + 1)}
              className="arrow-hover absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-[#081F7C] transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
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
              aria-label={`ไปที่สไลด์ ${i + 1}`}
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
