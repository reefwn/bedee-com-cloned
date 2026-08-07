'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Slide = {
  headline: string
  body?: string | null
  image: { url?: string | null; alt?: string | null }
  ctaLabel?: string | null
  ctaUrl?: string | null
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

// Entrance on slide change: key={index} remounts the slide wrapper below, and
// @starting-style + var(--ease-out) (globals.css) animate it in — 400ms fade
// + 6px rise. See animation-plans/001-hero-crossfade-starting-style.md.
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5_000)
    return () => window.clearInterval(timer)
  }, [slides.length, prefersReducedMotion, index])

  if (!slides?.length) return null
  const slide = slides[index]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white"
      style={{ minHeight: 720 }}
    >
      <div className="mx-auto flex min-h-[720px] max-w-6xl px-12 py-14 md:px-20">
        <div
          key={index}
          className="hero-slide flex flex-1 flex-col items-center gap-4 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] md:flex-row md:gap-12 [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
        >
          <div className="flex-1 text-center md:text-left">
            <h1 className="whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px]">
              {slide.headline}
            </h1>
            {slide.body && (
              <p className="mt-4 text-lg font-medium leading-relaxed">{slide.body}</p>
            )}
            {slide.ctaLabel && slide.ctaUrl && (
              <a
                href={slide.ctaUrl}
                className="mt-6 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
              >
                {slide.ctaLabel}
              </a>
            )}
          </div>
          <div className="relative flex-1">
            {slide.image?.url && (
              <Image
                src={slide.image.url}
                alt={slide.image.alt || ''}
                width={640}
                height={654}
                className="max-h-[580px] w-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="arrow-hover absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="arrow-hover absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
