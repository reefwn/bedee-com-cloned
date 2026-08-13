import { cache } from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

// Always reads live from Payload/Postgres — never statically prerendered.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'
const TITLE = 'BeDee — แพลตฟอร์มให้บริการด้านสุขภาพ'
const DESCRIPTION = 'ปรึกษาหมอออนไลน์ ปรึกษาเภสัชกร ส่งยา — Powered by BDMS'

// cache() dedupes this against generateMetadata's identical lookup for the
// same request — same reasoning as every other page's getItem/getProduct.
const getHomeData = cache(async () => {
  const payload = await getPayload({ config })
  const [homeResult, header, footer] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, depth: 2, limit: 1 }),
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 0 }),
  ])
  return { home: homeResult.docs[0], header, footer }
})

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getHomeData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout = (home?.layout ?? []) as any[]
  const hero = layout.find((b) => b.blockType === 'heroCarousel')
  const heroImageUrl: string | undefined = hero?.slides?.[0]?.image?.url ?? hero?.backgroundImage?.url

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'website',
      url: '/',
      images: heroImageUrl ? [{ url: heroImageUrl, alt: TITLE }] : undefined,
    },
    twitter: {
      card: heroImageUrl ? 'summary_large_image' : 'summary',
      title: TITLE,
      description: DESCRIPTION,
      images: heroImageUrl ? [heroImageUrl] : undefined,
    },
  }
}

export default async function HomePage() {
  const { home, header, footer } = await getHomeData()

  const logoUrl = header?.logo && typeof header.logo === 'object' ? header.logo.url : undefined
  const sameAs = (footer?.socialLinks ?? []).map((s) => s.url).filter((url): url is string => Boolean(url))

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BeDee',
    url: SITE_URL,
    description: DESCRIPTION,
    logo: logoUrl ? `${SITE_URL}${logoUrl}` : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BeDee',
    url: SITE_URL,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {home?.layout ? <RenderBlocks blocks={home.layout as any[]} /> : (
        <main className="p-16 text-center text-muted">
          No <code>home</code> page document found yet — create one in{' '}
          <a className="underline" href="/admin/collections/pages">
            /admin/collections/pages
          </a>{' '}
          with slug &quot;home&quot; and add the section blocks.
        </main>
      )}
      <SiteFooter />
    </>
  )
}
