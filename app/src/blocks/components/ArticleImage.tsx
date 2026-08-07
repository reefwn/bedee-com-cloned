'use client'

import Image from 'next/image'
import { useState } from 'react'

// Some source images (migrated from WordPress, several multi-MB) occasionally
// fail or time out through Vercel's on-demand image transform. next/image's
// onError only fires a callback — it doesn't auto-swap src — so this tracks
// failure state itself and swaps to a flat on-brand placeholder instead of a
// broken-image icon.
export function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-panel-1">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-tertiary">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 33vw, 100vw"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  )
}
