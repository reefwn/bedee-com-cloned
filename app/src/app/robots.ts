import type { MetadataRoute } from 'next'

const SITE_URL = 'https://bedee-payload.vercel.app'

// AI SEO: explicit allow for AI-search crawlers (see ai-seo skill's bot
// access checklist) — default allow-all already covers them, but naming
// them explicitly documents intent and survives a future tightening of the
// default rule without silently locking AI citation out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Not /api — real image bytes (og:image, product/article photos) are
      // served from /api/media/file/*, and blocking /api would also block
      // Google Images from indexing them.
      { userAgent: '*', allow: '/', disallow: ['/admin'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
