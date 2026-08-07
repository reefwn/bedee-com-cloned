import { cache } from 'react'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { FAQ } from '@/blocks/components/FAQ'
import { ArticleGrid } from '@/blocks/components/ArticleGrid'

export const dynamic = 'force-dynamic'

type Params = { category: string; slug: string }

// Posts.ts validates this shape on write, but a defense-in-depth check at
// render/JSON-LD time costs nothing and guards against pre-existing rows.
const isSafeUrl = (url: string | null | undefined): url is string => !!url && /^https?:\/\//i.test(url)

// cache() dedupes this against the identical lookup generateMetadata makes
// for the same request — Payload's `find` isn't fetch-based, so Next's
// built-in fetch memoization doesn't cover it on its own.
const getPost = cache(async (category: string, slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { 'category.slug': { equals: category } }],
    },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPost(category, slug)
  if (!post) return {}

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || undefined
  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const path = `/article/${category}/${slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      images: image?.url ? [{ url: image.url, alt: image.alt ?? post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image?.url ? [image.url] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params
  const post = await getPost(category, slug)

  if (!post) notFound()

  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const categoryDoc = typeof post.category === 'object' ? post.category : null
  const path = `/article/${category}/${slug}`
  const relatedPosts = (post.relatedPosts ?? []).filter(
    (p): p is Exclude<typeof p, number> => typeof p === 'object',
  )

  // Article schema for search engines; citation feeds the References list
  // below into AI answer engines' source-attribution. Breadcrumb schema
  // mirrors the site's actual nav depth (Home > บทความ > category > post).
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: image?.url ?? undefined,
    datePublished: post.publishedAt ?? post.updatedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: 'BeDee' },
    publisher: { '@type': 'Organization', name: 'BeDee' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': path },
    citation: post.references?.length
      ? post.references.map((r) => r.url).filter(isSafeUrl)
      : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'บทความสุขภาพ', item: '/article' },
      categoryDoc
        ? {
            '@type': 'ListItem',
            position: 3,
            name: categoryDoc.name,
            item: `/article?category=${categoryDoc.slug}`,
          }
        : null,
      { '@type': 'ListItem', position: categoryDoc ? 4 : 3, name: post.title, item: path },
    ].filter(Boolean),
  }

  return (
    <>
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
        <h1 className="text-4xl font-semibold leading-tight text-[#081F7C]">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-[#666]">{post.excerpt}</p> : null}
        {/* AI SEO: recency signal — AI systems weight freshness heavily */}
        <p className="mt-2 text-sm text-[#999]">
          Last updated: {new Date(post.updatedAt).toLocaleDateString('th-TH')}
        </p>
        {image?.url ? (
          // The migrated source image dimensions vary, so preserve their natural ratio.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="my-8 w-full rounded-2xl" src={image.url} alt={image.alt ?? post.title} />
        ) : null}
        {post.content ? (
          <RichText
            className="space-y-5 leading-8 text-[#222] [&_a]:text-[#317DF5] [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#081F7C] [&_h3]:pt-3 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc"
            data={post.content}
          />
        ) : null}
        {post.references?.length ? (
          <section className="mt-10 border-t border-[#eee] pt-6">
            <h2 className="text-lg font-semibold text-[#081F7C]">References</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-[#666]">
              {post.references.map((ref, i) => (
                <li key={i}>
                  {isSafeUrl(ref.url) ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[#317DF5] underline">
                      {ref.text}
                    </a>
                  ) : (
                    ref.text
                  )}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
      <FAQ heading={post.faqs?.length ? 'คำถามที่พบบ่อย' : undefined} items={post.faqs ?? []} />
      {relatedPosts.length ? (
        <ArticleGrid heading="บทความที่เกี่ยวข้อง" posts={relatedPosts as any} />
      ) : null}
      <SiteFooter />
    </>
  )
}
