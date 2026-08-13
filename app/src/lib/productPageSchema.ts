import type { Product } from '@/payload-types'

const SITE_URL = 'https://bedee-payload.vercel.app'

export function buildProductPageSchema(product: Product) {
  const image = typeof product.image === 'object' ? product.image : null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: image?.url ? `${SITE_URL}${image.url}` : undefined,
    description: product.shortDescription || product.description || undefined,
    url: `${SITE_URL}/health-mall/${product.slug}`,
    offers:
      typeof product.price === 'number'
        ? { '@type': 'Offer', price: product.price, priceCurrency: 'THB', url: product.externalUrl }
        : undefined,
  }
}

// Real pharmacist Q&A from the source page (see backfill-product-faqs.ts) —
// only emitted when the product actually has scraped FAQs, never fabricated.
export function buildProductFaqSchema(product: Product) {
  const faqs = (product.faqs ?? []).filter((f) => f.question && f.answer)
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function buildProductBreadcrumbSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ช้อปสินค้าสุขภาพ', item: `${SITE_URL}/health-mall` },
      { '@type': 'ListItem', position: 3, name: product.title, item: `${SITE_URL}/health-mall/${product.slug}` },
    ],
  }
}
