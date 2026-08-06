import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// AI SEO: structured, parseable pricing for AI shopping agents — see ai-seo
// skill's machine-readable-files guidance. Sourced from Services.pricing so
// editors keep one place to update tiers, not two (page copy + this file).
export async function GET() {
  const payload = await getPayload({ config })
  const services = await payload.find({ collection: 'services', limit: 50 })

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

  if (lines.length === 1) {
    lines.push('\nNo published pricing yet — add tiers under Services in the Payload admin.')
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
