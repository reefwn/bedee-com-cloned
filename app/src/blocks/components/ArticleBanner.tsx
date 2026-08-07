'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArticleImage } from './ArticleImage'

type BannerPost = {
  id: string
  title: string
  slug: string
  category: { slug: string }
  featuredImage: { url?: string | null; alt?: string | null }
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

// Mirrors bedee.com/article's banner: a Swiper carousel initialized with
// { autoplay: { delay: 3500, disableOnInteraction: false }, loop: true,
// effect: 'fade', pagination: { clickable: true } } and no arrows (nav
// commented out in the source's own init script). Reimplemented here with
// the same key-remount + @starting-style fade this codebase already uses
// for the homepage hero carousel (HeroCarousel.tsx).
export function ArticleBanner({ posts }: { posts: BannerPost[] }) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (posts.length < 2 || prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % posts.length)
    }, 3_500)
    return () => window.clearInterval(timer)
  }, [posts.length, prefersReducedMotion, index])

  if (!posts?.length) return null
  const post = posts[index]

  return (
    <div className="relative mt-8 aspect-video overflow-hidden bg-gray-100">
      <Link
        key={index}
        href={`/article/${post.category?.slug}/${post.slug}`}
        className="banner-slide absolute inset-0 block [transition:opacity_400ms_var(--ease-out)] [@starting-style]:opacity-0 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
      >
        {post.featuredImage?.url && (
          <ArticleImage src={post.featuredImage.url} alt={post.featuredImage.alt || ''} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,36,88,0.8)] via-transparent to-transparent" />
        <span className="absolute inset-x-0 bottom-8 line-clamp-2 px-4 text-lg font-semibold text-white md:px-6 md:text-2xl">
          {post.title}
        </span>
      </Link>
      {posts.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {posts.map((p, i) => (
            <button
              key={p.id}
              aria-label={`ไปที่สไลด์ ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-opacity focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                i === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
