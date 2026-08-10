// AI SEO: ItemList/Product schema for any productCarousel block already on a
// page — see ai-seo skill. Generic across pages, sourced from the real
// Products collection data (title/price/image/externalUrl), never fabricated.

const SITE_URL = 'https://bedee-payload.vercel.app'

export type ProductListSchema = {
  '@context': 'https://schema.org'
  '@type': 'ItemList'
  name: string
  itemListElement: {
    '@type': 'ListItem'
    position: number
    item: {
      '@type': 'Product'
      name: string
      image?: string
      url: string
      offers?: { '@type': 'Offer'; price: number; priceCurrency: 'THB'; url: string }
    }
  }[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractProductListSchemas(layout: any[]): ProductListSchema[] {
  const schemas: ProductListSchema[] = []

  for (const block of layout ?? []) {
    if (block.blockType !== 'productCarousel') continue
    const products = (block.products ?? []).filter((p: any) => typeof p === 'object')
    if (!products.length) continue

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: block.heading || 'Products',
      itemListElement: products.map((p: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.title,
          image: p.image?.url ? `${SITE_URL}${p.image.url}` : undefined,
          url: p.externalUrl,
          offers:
            typeof p.price === 'number'
              ? { '@type': 'Offer', price: p.price, priceCurrency: 'THB', url: p.externalUrl }
              : undefined,
        },
      })),
    })
  }

  return schemas
}
