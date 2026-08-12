'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'bedee-cookie-consent'
const PRIVACY_POLICY_URL = 'https://www.bedee.com/privacy-policy'

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

// Real copy + 3-action shape read off bedee.com's own cookie banner
// (.dpdpa--popup) — its own version is broken (buttons are dead "#" links
// with no persistence, so it reappears on every page load). localStorage
// (not sessionStorage, unlike AppStickyBanner's per-session dismiss) is
// what actually satisfies "once accepted, don't show again" across visits.
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setVisible(localStorage.getItem(CONSENT_KEY) === null)
  }, [])

  const choose = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[60] [box-shadow:0_-2px_12px_rgba(0,0,0,0.12)] ${
        prefersReducedMotion ? '' : '[transition:transform_250ms_var(--ease-out)]'
      } ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      aria-hidden={!visible}
    >
      <div className="flex flex-col items-center gap-4 bg-white px-6 py-5 md:flex-row md:justify-between md:px-8">
        <p className="max-w-2xl text-center text-sm leading-relaxed text-ink md:text-left">
          เราใช้คุกกี้เพื่อพัฒนาประสิทธิภาพ และประสบการณ์ที่ดีในการใช้เว็บไซต์ของคุณ คุณสามารถศึกษารายละเอียดได้ที่{' '}
          <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="text-secondary underline-offset-2 hover:underline">
            นโยบายความเป็นส่วนตัว
          </a>{' '}
          และสามารถจัดการความเป็นส่วนตัวของคุณได้เองโดยคลิกที่ ตั้งค่า
        </p>
        <div className="flex shrink-0 items-center gap-6">
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink hover:text-secondary focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            ตั้งค่า
          </a>
          <button
            onClick={() => choose('rejected')}
            className="text-sm font-medium text-ink hover:text-secondary focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            ไม่ยอมรับ
          </button>
          <button
            onClick={() => choose('accepted')}
            className="rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  )
}
