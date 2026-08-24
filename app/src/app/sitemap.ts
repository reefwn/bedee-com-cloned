import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [pages, services, posts, products, newsAndActivities] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200, depth: 0 }),
    payload.find({ collection: 'services', limit: 200, depth: 0 }),
    payload.find({ collection: 'posts', limit: 1000, depth: 1, sort: '-publishedAt' }),
    payload.find({ collection: 'products', limit: 200, depth: 0 }),
    payload.find({ collection: 'news-and-activities', limit: 200, depth: 0 }),
  ])

  // "home" is served at the site root (already listed below) — the same
  // pages doc is also reachable at /home via the [slug] catch-all, which
  // now permanently redirects it back to / rather than serving a duplicate.
  const pageEntries = pages.docs
    .filter((page) => page.slug !== 'home')
    .map((page) => ({
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

  // Only health-mall products have an in-house detail page (`slug` set) —
  // health-plaza's package carousel reuses this same collection but stays
  // link-out only, so those docs have no slug and are skipped here.
  const productEntries = products.docs
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/health-mall/${product.slug}`,
      lastModified: product.updatedAt,
    }))

  const newsEntries = newsAndActivities.docs.map((item) => ({
    url: `${SITE_URL}/news-activities/${item.slug}`,
    lastModified: item.updatedAt,
  }))

  // Static routes with no backing `pages` doc (they were converted from a
  // flat richTextContent dump to a real bespoke route — see contact-us,
  // corporate, and news-activities' git history) — list them by hand so
  // dropping the pages doc doesn't silently drop them from the sitemap too.
  const staticEntries = ['/contact-us', '/corporate', '/news-activities', '/article'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date().toISOString(),
  }))

  return [
    { url: SITE_URL, lastModified: new Date().toISOString() },
    ...staticEntries,
    ...pageEntries,
    ...serviceEntries,
    ...postEntries,
    ...productEntries,
    ...newsEntries,
  ]
}
