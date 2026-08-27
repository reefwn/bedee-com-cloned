'use client'

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

// Matches FAQIndex's local convention (no shared hook in this codebase).
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

export function ContactBeDeeButton({ className, children }: { className: string; children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById('contact-us')?.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <a href="#contact-us" onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
