'use client'

import Image from 'next/image'
import { useState } from 'react'

type Slide = {
  headline: string
  body?: string | null
  image: { url?: string | null; alt?: string | null }
  ctaLabel?: string | null
  ctaUrl?: string | null
}

// Timeline per plans/04-final-prompt.md §3 Section 1: 500ms translateX crossfade,
// cubic-bezier(0.25,0.1,0.25,1) — Swiper.js library default, not a bespoke value.
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  if (!slides?.length) return null
  const slide = slides[index]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white"
      style={{ minHeight: 810 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-20 py-16 md:flex-row">
        <div
          className="flex-1 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          key={index}
        >
          <h1 className="text-[72px] font-semibold leading-[1.1]">{slide.headline}</h1>
          {slide.body && <p className="mt-4 text-lg font-medium leading-relaxed">{slide.body}</p>}
          {slide.ctaLabel && slide.ctaUrl && (
            <a
              href={slide.ctaUrl}
              className="mt-6 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
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
              className="rounded-full object-cover"
            />
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl"
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
