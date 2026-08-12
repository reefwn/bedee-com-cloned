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
