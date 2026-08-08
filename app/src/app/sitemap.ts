import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [pages, services, posts] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200, depth: 0 }),
    payload.find({ collection: 'services', limit: 200, depth: 0 }),
    payload.find({ collection: 'posts', limit: 1000, depth: 1, sort: '-publishedAt' }),
  ])

  const pageEntries = pages.docs.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: page.updatedAt,
  }))

  const serviceEntries = services.docs.map((service) => ({
    url: `${SITE_URL}/${service.slug}`,
    lastModified: service.updatedAt,
  }))

  const postEntries = posts.docs
    .map((post) => {
      const category = typeof post.category === 'object' ? post.category?.slug : null
      if (!category) return null
      return {
        url: `${SITE_URL}/article/${category}/${post.slug}`,
        lastModified: post.updatedAt,
      }
    })
    .filter((entry): entry is { url: string; lastModified: string } => entry !== null)

  return [{ url: SITE_URL, lastModified: new Date().toISOString() }, ...pageEntries, ...serviceEntries, ...postEntries]
}
