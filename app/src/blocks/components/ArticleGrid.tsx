import Link from 'next/link'
import { ArticleImage } from './ArticleImage'

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage: { url?: string | null; alt?: string | null }
  category: { slug: string; name: string }
}

// Section 7 of plans/04-final-prompt.md §3 — 3-col grid, 16:9 cards, category badge.
export function ArticleGrid({
  heading,
  posts,
  variant = 'plain',
}: {
  heading?: string | null
  posts: Post[]
  variant?: 'tinted' | 'plain' | null
}) {
  if (!posts?.length) return null
  const background = variant === 'tinted' ? 'bg-panel-2' : ''

  return (
    <section className={`${background} py-16`}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && <h2 className="text-[28px] font-semibold text-primary">{heading}</h2>}
        <div className="mt-8 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/article/${post.category.slug}/${post.slug}`}
              className="block focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {post.featuredImage?.url && (
                  <ArticleImage src={post.featuredImage.url} alt={post.featuredImage.alt || ''} />
                )}
                {/* bg-primary, not bg-secondary — white-on-secondary measured 3.9:1, below WCAG AA's 4.5:1 */}
                <span className="absolute right-2 top-2 rounded-pill bg-primary px-3 py-1 text-xs text-white">
                  {post.category.name}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 font-bold text-primary">{post.title}</h3>
            </Link>
          ))}
        </div>
        <a
          href="/article"
          className="mt-8 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
        >
          ดูทั้งหมด ›
        </a>
      </div>
    </section>
  )
}
