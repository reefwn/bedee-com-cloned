import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// AI SEO: hand-authored llms.txt — overview + differentiators + key links,
// not just a sitemap dump (that's what Rank Math's auto-generated version on
// the live WordPress site does today; see ai-seo skill audit findings).
export async function GET() {
  const payload = await getPayload({ config })

  // The site's real service pages (teleconsultation, telepharmacy,
  // health-mall, health-plaza) live in `pages`, not a separate `services`
  // collection (that one's unused/empty) — query by their known slugs so
  // this section reflects the actual live routes, titles pulled from the CMS.
  const SERVICE_SLUGS = ['teleconsultation', 'telepharmacy', 'health-mall', 'health-plaza']
  const [settings, servicePages, posts, news] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({ collection: 'pages', where: { slug: { in: SERVICE_SLUGS } }, limit: 20 }),
    payload.find({ collection: 'posts', limit: 10, sort: '-publishedAt', depth: 1 }),
    payload.find({ collection: 'news-and-activities', limit: 10, sort: '-publishedAt' }),
  ])

  const lines: string[] = []
  lines.push('# BeDee: Powered by BDMS')
  if (settings.tagline) lines.push(`\n> ${settings.tagline}`)
  if (settings.shortDescription) lines.push(`\n${settings.shortDescription}`)

  if (settings.stats?.length) {
    lines.push('\n## Key facts')
    for (const stat of settings.stats) {
      const asOf = stat.asOf ? new Date(stat.asOf).toISOString().slice(0, 10) : ''
      lines.push(`- ${stat.label}: ${stat.value}${asOf ? ` (as of ${asOf})` : ''}`)
    }
  }

  if (servicePages.docs.length) {
    lines.push('\n## Services')
    // Preserve the intended nav order rather than whatever order Postgres
    // happens to return an `in` query in.
    const bySlug = new Map(servicePages.docs.map((p) => [p.slug, p]))
    for (const slug of SERVICE_SLUGS) {
      const page = bySlug.get(slug)
      if (page) lines.push(`- [${page.title}](/${slug})`)
    }
  }

  lines.push('\n## For businesses')
  lines.push('- [สำหรับองค์กร (corporate employee health benefits)](/corporate)')

  lines.push('\n## FAQ')
  lines.push('- [คำถามที่พบบ่อย (45 Q&A: teleconsultation, telepharmacy, delivery, insurance, account & security)](/faqs)')

  if (posts.docs.length) {
    lines.push('\n## Recent articles')
    for (const post of posts.docs) {
      const category = typeof post.category === 'object' ? post.category.slug : null
      lines.push(
        category ? `- [${post.title}](/article/${category}/${post.slug})` : `- ${post.title}`,
      )
    }
  }

  if (news.docs.length) {
    lines.push('\n## Recent news & activities')
    for (const item of news.docs) {
      lines.push(`- [${item.title}](/news-activities/${item.slug})`)
    }
  }

  lines.push('\n## Pricing')
  lines.push('- [/pricing.md](/pricing.md)')

  lines.push('\n## Sitemap')
  lines.push('- [/sitemap.xml](/sitemap.xml)')

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
