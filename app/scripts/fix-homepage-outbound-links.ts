import { getPayload } from 'payload'
import config from '../src/payload.config'

const dryRun = process.argv.includes('--dry-run')

// /impeccable polish finding: hero CTAs and an icon-grid item link straight
// to bedee.com even though this app has its own routes for the same content
// — contradicts PRODUCT.md's "nothing should silently depend on bedee.com
// staying online" principle. shop.bedee.com and /community are left
// untouched: shop.bedee.com is a genuinely separate storefront (see
// PRODUCT.md's open Products decision) and /community has no equivalent
// page in this app yet, so pointing it at bedee.com temporarily beats
// inventing a page or 404ing.
const URL_REWRITES: Record<string, string> = {
  'https://www.bedee.com/teleconsultation': '/teleconsultation',
  'https://www.bedee.com/health-mall': '/health-mall',
}

function rewriteUrl(url: string | null | undefined) {
  if (!url) return url
  return URL_REWRITES[url] ?? url
}

async function main() {
  const payload = await getPayload({ config })
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const page = home.docs[0]
  if (!page) throw new Error('No "home" page found')

  const layout = Array.isArray(page.layout) ? page.layout : []
  let changed = 0

  const newLayout = layout.map((block: any) => {
    if (block.blockType === 'heroCarousel' && Array.isArray(block.slides)) {
      return {
        ...block,
        slides: block.slides.map((slide: any) => {
          const rewritten = rewriteUrl(slide.ctaUrl)
          if (rewritten !== slide.ctaUrl) changed++
          return { ...slide, ctaUrl: rewritten }
        }),
      }
    }
    if (block.blockType === 'iconGrid' && Array.isArray(block.items)) {
      return {
        ...block,
        items: block.items.map((item: any) => {
          const rewritten = rewriteUrl(item.url)
          if (rewritten !== item.url) changed++
          return { ...item, url: rewritten }
        }),
      }
    }
    return block
  })

  console.log(`${dryRun ? '[dry-run] ' : ''}${changed} URL(s) to rewrite`)
  if (!dryRun && changed > 0) {
    await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
    console.log('Updated home page layout')
  }

  await Promise.race([payload.destroy(), new Promise<void>((resolve) => setTimeout(resolve, 2_000))])
  process.exit(0)
}

main()
