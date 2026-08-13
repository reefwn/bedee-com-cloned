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
      className={`app-sticky-banner fixed inset-x-0 top-0 z-[60] flex min-h-16 items-center justify-between gap-2 bg-[#214cbf] px-3 py-1.5 md:gap-4 md:px-8 ${
        prefersReducedMotion ? '' : '[transition:transform_250ms_var(--ease-out)]'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      aria-hidden={!visible}
    >
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <Image src="/app-badges/bedee-app.webp" alt="BeDee" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full" />
        {/* Hidden below sm: at that width the real (unsquished) badge pills
        already take up most of the row, and "icon + badges" reads fine on
        its own without the label wrapping to 3 cramped lines. */}
        <p className="hidden min-w-0 text-sm font-medium leading-tight text-white sm:block md:text-base">
          ดาวน์โหลดแอป BeDee
          <span className="hidden md:inline"> ดูแลสุขภาพครบวงจรในที่เดียว</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        {/* The badge SVGs are the full "Download on the App Store" / "Get it on
        Google Play" pill art (~3.3:1 aspect ratio) — sized by height with width
        auto so they render at their real proportions instead of a forced square. */}
        <a
          href={APPSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ดาวน์โหลดบน App Store"
          className="flex h-11 shrink-0 items-center justify-center px-1 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(255,255,255,0.6)]"
        >
          <Image src="/app-badges/apple-icon.svg" alt="" width={207} height={62} className="h-7 w-auto" />
        </a>
        <a
          href={PLAYSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ดาวน์โหลดบน Google Play"
          className="flex h-11 shrink-0 items-center justify-center px-1 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(255,255,255,0.6)]"
        >
          <Image src="/app-badges/google-icon.svg" alt="" width={120} height={37} className="h-7 w-auto" />
        </a>
        <button
          onClick={dismiss}
          aria-label="ปิด"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-white/80 hover:text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(255,255,255,0.6)]"
        >
          ×
        </button>
      </div>
    </div>
  )
}
