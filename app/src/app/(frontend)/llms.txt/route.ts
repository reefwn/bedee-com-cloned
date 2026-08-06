import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// AI SEO: hand-authored llms.txt — overview + differentiators + key links,
// not just a sitemap dump (that's what Rank Math's auto-generated version on
// the live WordPress site does today; see ai-seo skill audit findings).
export async function GET() {
  const payload = await getPayload({ config })

  const [settings, services, posts] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({ collection: 'services', limit: 20 }),
    payload.find({ collection: 'posts', limit: 10, sort: '-publishedAt', depth: 1 }),
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

  if (services.docs.length) {
    lines.push('\n## Services')
    for (const service of services.docs) {
      lines.push(`- [${service.title}](/${service.slug})`)
    }
  }

  if (posts.docs.length) {
    lines.push('\n## Recent articles')
    for (const post of posts.docs) {
      const category = typeof post.category === 'object' ? post.category.slug : null
      lines.push(
        category ? `- [${post.title}](/article/${category}/${post.slug})` : `- ${post.title}`,
      )
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
