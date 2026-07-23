import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

type NavChild = { label?: string | null; url?: string | null }
type NavItem = { label?: string | null; url?: string | null; children?: NavChild[] | null }

// Section 0 of plans/04-final-prompt.md §3 — solid white, non-sticky, 80px, no
// scroll-triggered color/size morph.
export async function SiteHeader() {
  const payload = await getPayload({ config })
  const header = await payload.findGlobal({ slug: 'header', depth: 1 })
  const navItems = (header?.navItems ?? []) as NavItem[]

  return (
    <header className="flex h-20 items-center justify-between border-b px-8">
      <Link href="/">
        {header?.logo && typeof header.logo === 'object' && header.logo.url ? (
          <Image src={header.logo.url} alt="BeDee" width={120} height={40} />
        ) : (
          <span className="text-xl font-bold text-primary">BeDee</span>
        )}
      </Link>
      <nav className="flex gap-8">
        {navItems.map((item, i) => (
          <div key={i} className="group relative">
            <Link href={item.url || '#'} className="text-base font-medium text-ink hover:text-secondary">
              {item.label}
            </Link>
            {item.children?.length ? (
              <div className="absolute left-0 top-full hidden min-w-[180px] flex-col gap-2 bg-white p-3 shadow group-hover:flex">
                {item.children.map((child: NavChild, j: number) => (
                  <Link key={j} href={child.url || '#'} className="text-sm text-ink hover:text-secondary">
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </header>
  )
}
