import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

type FooterLink = { label?: string | null; url?: string | null }
type LinkGroup = { heading?: string | null; links?: FooterLink[] | null }

// Footer of plans/04-final-prompt.md §3 — bg #F0F0F0, logo+tagline col + 4 link cols.
export async function SiteFooter() {
  const payload = await getPayload({ config })
  const [footer, header] = await Promise.all([
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.findGlobal({ slug: 'header', depth: 1 }),
  ])
  const linkGroups = (footer?.linkGroups ?? []) as LinkGroup[]
  const logo =
    header?.logo && typeof header.logo === 'object' && header.logo.url ? header.logo : null

  return (
    <footer className="bg-footer-bg px-8 py-12">
      <div className="mx-auto flex max-w-5xl flex-wrap gap-12">
        <div className="w-full md:w-1/4">
          <Link href="/" aria-label="BeDee home" className="inline-block">
            {logo ? (
              <Image
                src={logo.url!}
                alt={logo.alt || 'BeDee'}
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-primary">BeDee</span>
            )}
          </Link>
          {footer?.tagline && <p className="mt-2 text-sm text-muted">{footer.tagline}</p>}
        </div>
        {linkGroups.map((group, i) => (
          <div key={i}>
            <p className="font-semibold text-ink">{group.heading}</p>
            <ul className="mt-2 space-y-1">
              {(group.links ?? []).map((link: FooterLink, j: number) => (
                <li key={j}>
                  <a href={link.url || '#'} className="text-sm text-muted hover:text-secondary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-5xl border-t pt-4 text-sm text-muted">
        © Copyright 2026 BeDee All rights reserved.
      </div>
    </footer>
  )
}
