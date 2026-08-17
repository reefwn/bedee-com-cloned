import { cache } from 'react'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

// Next.js does not auto-decode non-ASCII dynamic-route segments — `params.slug`
// arrives as the raw percent-encoded string, but the `slug` field stores the
// decoded Thai text (see backfill-news-and-activities.ts's slugFromUrl).
const getItem = cache(async (rawSlug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'news-and-activities',
    where: { slug: { equals: decodeURIComponent(rawSlug) } },
    depth: 1,
    limit: 1,
    draft,
  })
  return result.docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return {}

  const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
  const path = `/news-activities/${slug}`

  return {
    title: item.title,
    description: item.excerpt || undefined,
    alternates: { canonical: path },
    openGraph: {
      title: item.title,
      description: item.excerpt || undefined,
      type: 'article',
      url: path,
      publishedTime: item.publishedAt ?? undefined,
      modifiedTime: item.updatedAt,
      images: image?.url ? [{ url: image.url, alt: image.alt ?? item.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.excerpt || undefined,
      images: image?.url ? [image.url] : undefined,
    },
  }
}

export default async function NewsActivityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = await getItem(slug)
  const { isEnabled: draft } = await draftMode()

  if (!item) notFound()

  const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
  const path = `/news-activities/${slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt ?? undefined,
    image: image?.url ?? undefined,
    datePublished: item.publishedAt ?? item.updatedAt,
    dateModified: item.updatedAt,
    author: { '@type': 'Organization', name: 'BeDee' },
    publisher: { '@type': 'Organization', name: 'BeDee' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': path },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'ข่าวสารและกิจกรรม', item: '/news-activities' },
      { '@type': 'ListItem', position: 3, name: item.title, item: path },
    ],
  }

  return (
    <>
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-semibold leading-tight text-primary">{item.title}</h1>
        {item.excerpt ? <p className="mt-4 text-lg text-muted">{item.excerpt}</p> : null}
        {item.publishedAt ? (
          <p className="mt-2 text-sm text-muted">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</p>
        ) : null}
        {image?.url ? (
          // Square corners per the Two-Shape Rule — content imagery, not a
          // rounded interactive element.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="my-8 w-full" src={image.url} alt={image.alt ?? item.title} />
        ) : null}
        {item.content ? (
          <RichText
            className="space-y-5 leading-8 text-[#222] [&_a]:text-[#317DF5] [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#081F7C] [&_h3]:pt-3 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc"
            data={item.content}
          />
        ) : null}
      </main>
      <SiteFooter />
    </>
  )
}
