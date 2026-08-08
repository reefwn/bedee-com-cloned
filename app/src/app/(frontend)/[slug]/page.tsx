import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ServiceDetail } from '@/components/ServiceDetail'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { extractHowToSchemas } from '@/lib/howToSchema'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

const getContent = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
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
  const content = await getContent(slug)
  if (!content) return {}

  // Services has no `seo` group today (a separate, pre-existing gap) —
  // only Pages docs get a real meta description until that's added.
  const seo = content.type === 'page' ? content.doc.seo : undefined
  const title = seo?.metaTitle || content.doc.title
  const description = seo?.metaDescription || undefined
  const path = `/${slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'website', url: path },
    twitter: { card: 'summary', title, description },
  }
}

export default async function ContentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const content = await getContent(slug)

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {howToSchemas.map((schema, i) => (
        <script
          key={i}
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
