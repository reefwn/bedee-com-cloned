import { cache } from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ServiceDetail } from '@/components/ServiceDetail'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { extractHowToSchemas } from '@/lib/howToSchema'
import { extractProductListSchemas } from '@/lib/productSchema'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

const getContent = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft,
  })
  const page = pageResult.docs[0]
  if (page) return { type: 'page' as const, doc: page }

  // Live site serves service pages (teleconsultation, telepharmacy,
  // health-mall) at this same flat top-level slug — see
  // plans/01-site-dna.md §1.8. Fall back to `services` before 404ing.
  const serviceResult = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft,
  })
  const service = serviceResult.docs[0]
  if (service) return { type: 'service' as const, doc: service }

  return null
})

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'home') return {}
  const content = await getContent(slug)
  if (!content) return {}

  // Services has no `seo` group today (a separate, pre-existing gap) —
  // only Pages docs get a real meta description until that's added.
  const seo = content.type === 'page' ? content.doc.seo : undefined
  const title = seo?.metaTitle || content.doc.title
  const description = seo?.metaDescription || undefined
  const path = `/${slug}`
  const imageUrl = getImageUrl(content)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getImageUrl(content: { type: 'page' | 'service'; doc: any }): string | undefined {
  if (content.type === 'service') {
    return content.doc.heroImage?.url ?? undefined
  }
  const hero = (content.doc.layout ?? []).find((b: any) => b.blockType === 'heroCarousel') // eslint-disable-line @typescript-eslint/no-explicit-any
  return hero?.slides?.[0]?.image?.url ?? hero?.backgroundImage?.url ?? undefined
}

export default async function ContentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  // The real homepage is served at `/` (src/app/(frontend)/page.tsx) — this
  // catch-all also matches the "home" pages doc by slug, which duplicated
  // it at /home with a conflicting self-canonical and a different H1/title.
  if (slug === 'home') permanentRedirect('/')
  const content = await getContent(slug)
  const { isEnabled: draft } = await draftMode()

  if (!content) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.doc.title,
    description: content.type === 'page' ? content.doc.seo?.metaDescription ?? undefined : undefined,
    url: `/${slug}`,
    publisher: { '@type': 'Organization', name: 'BeDee' },
  }
  const howToSchemas =
    content.type === 'page' ? extractHowToSchemas((content.doc.layout ?? []) as any[]) : [] // eslint-disable-line @typescript-eslint/no-explicit-any
  const productListSchemas =
    content.type === 'page' ? extractProductListSchemas((content.doc.layout ?? []) as any[]) : [] // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <>
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {howToSchemas.map((schema, i) => (
        <script
          key={`howto-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      {productListSchemas.map((schema, i) => (
        <script
          key={`products-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <SiteHeader />
      {content.type === 'page' ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <RenderBlocks blocks={(content.doc.layout ?? []) as any[]} />
      ) : (
        <ServiceDetail service={content.doc} />
      )}
      <SiteFooter />
    </>
  )
}
