import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ProductDetail } from '@/components/ProductDetail'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { buildProductBreadcrumbSchema, buildProductFaqSchema, buildProductPageSchema } from '@/lib/productPageSchema'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

const getProduct = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}

  const title = `${product.title} - BeDee`
  const description = product.shortDescription || product.description || undefined
  const path = `/health-mall/${slug}`
  const image = typeof product.image === 'object' ? product.image : null

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images: image?.url ? [{ url: image.url, alt: product.title }] : undefined,
    },
    twitter: {
      card: image?.url ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image?.url ? [image.url] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const jsonLd = buildProductPageSchema(product)
  const breadcrumbJsonLd = buildProductBreadcrumbSchema(product)
  const faqJsonLd = buildProductFaqSchema(product)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <SiteHeader />
      <ProductDetail product={product} />
      <SiteFooter />
    </>
  )
}
