'use client'

import Link from 'next/link'
import { useState } from 'react'

type NavChild = { label?: string | null; url?: string | null }
type NavItem = { label?: string | null; url?: string | null; children?: NavChild[] | null }

// Desktop nav is CSS-only (hover/focus dropdowns) and stays inline in
// SiteHeader — it never needed client state. Below md, that same nav has
// nowhere to put 5 items + dropdowns without wrapping into the logo, so this
// is a separate hamburger + slide-down panel, md:hidden.
export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <nav className="absolute left-0 top-full flex w-full flex-col gap-1 border-b bg-white px-6 py-4 shadow">
          {navItems.map((item, i) => (
            <div key={i}>
              <Link
                href={item.url || '#'}
                onClick={() => !item.children?.length && setOpen(false)}
                className="block py-2 text-base font-medium text-ink hover:text-secondary focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
              >
                {item.label}
              </Link>
              {item.children?.length ? (
                <div className="ml-4 flex flex-col gap-1 border-l pl-4">
                  {item.children.map((child, j) => (
                    <Link
                      key={j}
                      href={child.url || '#'}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-sm text-ink hover:text-secondary focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
