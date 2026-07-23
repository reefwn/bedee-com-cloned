import { getPayload } from 'payload'
import config from '@payload-config'

type FooterLink = { label?: string | null; url?: string | null }
type LinkGroup = { heading?: string | null; links?: FooterLink[] | null }

// Footer of plans/04-final-prompt.md §3 — bg #F0F0F0, logo+tagline col + 4 link cols.
export async function SiteFooter() {
  const payload = await getPayload({ config })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
  const linkGroups = (footer?.linkGroups ?? []) as LinkGroup[]

  return (
    <footer className="bg-footer-bg px-8 py-12">
      <div className="mx-auto flex max-w-5xl flex-wrap gap-12">
        <div className="w-full md:w-1/4">
          <p className="text-xl font-bold text-primary">BeDee</p>
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
