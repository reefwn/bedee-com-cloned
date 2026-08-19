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
//
// variant "light" mirrors service-page heroes (e.g. bedee.com/teleconsultation):
// pale blue gradient, dark text, coral CTA — vs. the homepage's dark navy->blue
// gradient with white text. Defaults to "dark" so every existing homepage slide
// is visually unchanged.
export function HeroCarousel({
  slides,
  variant = 'dark',
  backgroundImage,
  headingLevel = 'h1',
}: {
  slides: Slide[]
  variant?: 'dark' | 'light' | 'coral' | 'teal' | null
  backgroundImage?: { url?: string | null } | null
  headingLevel?: 'h1' | 'h2'
}) {
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
  // Any non-"dark" variant with a real backgroundImage renders it as a photo
  // background instead of a flat gradient — decoupled from the specific
  // variant name so a new photo-hero (e.g. a different service page's own
  // brand color) never needs a code change, only a new enum label + upload.
  const isLight = variant !== 'dark'
  const bgImageUrl = backgroundImage?.url
  const hasBackgroundImage = Boolean(bgImageUrl)

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  // Homepage-only treatment (dark variant, flat gradient, no real bg photo —
  // every other hero use either has its own background photo already covering
  // the section, or is a different variant): the slide image bleeds full-
  // height to the section's right edge and fades into the gradient on the
  // edge nearest the text, instead of sitting in a separate boxed thumbnail.
  const useBleedImage = variant === 'dark' && !hasBackgroundImage && Boolean(slide.image?.url)
  const fadeToRight = { maskImage: 'linear-gradient(to right, transparent 0%, black 35%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)' }
  const fadeToBottom = { maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' }

  return (
    <section
      className={`relative overflow-hidden ${isLight ? 'text-ink' : 'text-white'} ${
        hasBackgroundImage ? '' : isLight ? 'bg-gradient-to-br from-[#EAF4FF] to-[#CFE7FF]' : 'bg-gradient-to-br from-primary to-secondary'
      }`}
      style={
        hasBackgroundImage
          ? { minHeight: 720, backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { minHeight: 720 }
      }
    >
      {useBleedImage && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block" style={fadeToRight}>
          <Image
            src={slide.image.url as string}
            alt={slide.image.alt || ''}
            fill
            priority
            sizes="58vw"
            className="object-cover object-[68%_30%]"
          />
        </div>
      )}
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-6xl px-12 py-14 md:px-20">
        <div
          key={index}
          className="hero-slide flex flex-1 flex-col items-center gap-4 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] md:flex-row md:gap-12 [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
        >
          <div className={`flex-1 text-center md:text-left ${useBleedImage ? 'md:max-w-[560px] md:flex-none' : 'md:flex-[3]'}`}>
            {headingLevel === 'h2' ? (
              <h2
                className={`whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px] ${isLight ? 'text-primary' : ''}`}
              >
                {slide.headline}
              </h2>
            ) : (
              <h1
                className={`whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px] ${isLight ? 'text-primary' : ''}`}
              >
                {slide.headline}
              </h1>
            )}
            {slide.body && (
              <p className={`mt-4 text-lg font-medium leading-relaxed ${isLight ? 'text-ink' : ''}`}>
                {slide.body}
              </p>
            )}
            {slide.ctaLabel && slide.ctaUrl && (
              <a
                href={slide.ctaUrl}
                className={`mt-6 inline-block rounded-pill px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                  isLight ? 'bg-accent' : 'bg-primary'
                }`}
              >
                {slide.ctaLabel}
              </a>
            )}
          </div>
          {useBleedImage ? (
            <div className="relative h-64 w-full overflow-hidden rounded-[28px] md:hidden" style={fadeToBottom}>
              <Image
                src={slide.image.url as string}
                alt={slide.image.alt || ''}
                fill
                priority
                sizes="90vw"
                className="object-cover object-[68%_30%]"
              />
            </div>
          ) : (
            <div className="relative flex-1 md:flex-[2]">
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
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className={`arrow-hover absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${isLight ? 'text-primary' : ''}`}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className={`arrow-hover absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${isLight ? 'text-primary' : ''}`}
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
