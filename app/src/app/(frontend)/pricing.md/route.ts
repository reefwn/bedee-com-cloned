import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// AI SEO: structured, parseable pricing for AI shopping agents — see ai-seo
// skill's machine-readable-files guidance. Sourced from Services.pricing
// (consultation/service tiers) and Products (health-mall's real per-item
// prices) so editors keep one place to update each, not a second copy here.
export async function GET() {
  const payload = await getPayload({ config })
  const [services, products] = await Promise.all([
    payload.find({ collection: 'services', limit: 50 }),
    payload.find({ collection: 'products', limit: 200, sort: 'title' }),
  ])

  const lines: string[] = ['# Pricing — BeDee']

  for (const service of services.docs) {
    if (!service.pricing?.length) continue
    lines.push(`\n## ${service.title}`)
    for (const tier of service.pricing) {
      lines.push(`\n### ${tier.tierLabel}`)
      lines.push(`- Price: ${tier.price} ${tier.currency ?? 'THB'}`)
      if (tier.durationMinutes) lines.push(`- Duration: ${tier.durationMinutes} minutes`)
      if (tier.notes) lines.push(`- Notes: ${tier.notes}`)
    }
  }

  const priced = products.docs.filter((p) => typeof p.price === 'number')
  if (priced.length) {
    const prices = priced.map((p) => p.price as number)
    lines.push('\n## Health Mall — products')
    lines.push(
      `\n${priced.length} products, ฿${Math.min(...prices).toLocaleString()}–฿${Math.max(...prices).toLocaleString()} THB. Full catalog: /health-mall`,
    )
    for (const p of priced) {
      const original = typeof p.originalPrice === 'number' && p.originalPrice > (p.price as number)
        ? ` (was ฿${p.originalPrice.toLocaleString()})`
        : ''
      // health-plaza's package-style products have no local PDP slug — link
      // out to the real product page instead of a broken /health-mall/null.
      const link = p.slug ? `/health-mall/${p.slug}` : p.externalUrl
      lines.push(`- ${p.title}: ฿${(p.price as number).toLocaleString()} THB${original} — ${link}`)
    }
  }

  if (lines.length === 1) {
    lines.push('\nNo published pricing yet — add tiers under Services or prices under Products in the Payload admin.')
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
