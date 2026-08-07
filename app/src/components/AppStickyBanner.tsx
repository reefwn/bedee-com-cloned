'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const APPSTORE_URL =
  'https://bedee.onelink.me/iQMa/?pid=bedeewebsite&c=organicimageinstall_new_appstickybanner_221123&appstore'
const PLAYSTORE_URL =
  'https://bedee.onelink.me/iQMa/?pid=bedeewebsite&c=organicimageinstall_new_appstickybanner_221123&playstore'
const DISMISS_KEY = 'app-sticky-banner-dismissed'
const SCROLL_THRESHOLD = 400

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

// Static Sentinel Rule (DESIGN.md): the header itself never changes on
// scroll — this is a *separate* fixed bar, appearing once the (non-sticky)
// header has already scrolled out of view, so the two never overlap.
export function AppStickyBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1')

    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed) return null

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  return (
    <div
      className={`app-sticky-banner fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-between border-b bg-white px-4 md:px-8 ${
        prefersReducedMotion ? '' : '[transition:transform_250ms_var(--ease-out)]'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <Image src="/app-badges/bedee-app.webp" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full" />
        <p className="text-sm font-medium text-ink md:text-base">ดาวน์โหลดแอป BeDee ดูแลสุขภาพครบวงจรในที่เดียว</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" aria-label="ดาวน์โหลดบน App Store">
          <Image src="/app-badges/apple-icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </a>
        <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer" aria-label="ดาวน์โหลดบน Google Play">
          <Image src="/app-badges/google-icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </a>
        <button
          onClick={dismiss}
          aria-label="ปิด"
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg text-muted focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
        >
          ×
        </button>
      </div>
    </div>
  )
}
