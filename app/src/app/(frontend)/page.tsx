import { cache } from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { extractHowToSchemas } from '@/lib/howToSchema'

// Always reads live from Payload/Postgres — never statically prerendered.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'
const TITLE = 'BeDee — ปรึกษาหมอ เภสัชกร ส่งยา ช้อปสุขภาพออนไลน์ | Powered by BDMS'
const DESCRIPTION =
  'ปรึกษาหมอและเภสัชกรออนไลน์ พร้อมส่งยาและสินค้าสุขภาพถึงบ้าน ดูแลสุขภาพครบวงจรตลอด 24 ชม. ภายใต้มาตรฐานเครือโรงพยาบาล BDMS'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const howToSchemas = extractHowToSchemas((home?.layout ?? []) as any[])

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
      {howToSchemas.map((schema, i) => (
        <script
          key={`howto-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <SiteHeader />
      {/* Real, stable H1 — decoupled from the hero carousel's rotating slide
      headline (finding #5: H1 was slides[0].headline, so reordering slides
      in the CMS silently changed the page's H1). sr-only since the
      carousel's own headline is the visible design; this exists for
      SEO/a11y only. */}
      <h1 className="sr-only">BeDee — แพลตฟอร์มดูแลสุขภาพครบวงจร</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {home?.layout ? <RenderBlocks blocks={home.layout as any[]} heroHeadingLevel="h2" /> : (
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
