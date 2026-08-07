import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ArticleImage } from '@/blocks/components/ArticleImage'
import { ArticleBanner } from '@/blocks/components/ArticleBanner'

export const dynamic = 'force-dynamic'

export default async function ArticleListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: activeSlug } = await searchParams
  const payload = await getPayload({ config })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'name',
    limit: 100,
  })
  const activeCategory = activeSlug ? categories.docs.find((c: any) => c.slug === activeSlug) : undefined

  const [featured, result] = await Promise.all([
    payload.find({ collection: 'posts', sort: '-publishedAt', depth: 2, limit: 5 }),
    payload.find({
      collection: 'posts',
      sort: '-publishedAt',
      depth: 2,
      limit: 24,
      where: activeCategory ? { category: { equals: activeCategory.id } } : undefined,
    }),
  ])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-[28px] font-semibold text-primary">บทความสุขภาพ</h1>

        {/* Banner — auto-rotating carousel of the latest articles, mirroring bedee.com/article's Swiper widget */}
        <ArticleBanner posts={featured.docs as any} />

        {/* Category filter — pill list, round = interactive per the Two-Shape Rule */}
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          <Link
            href="/article"
            className={`shrink-0 rounded-pill px-5 py-2 text-[15px] font-medium focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
              !activeCategory ? 'bg-primary text-white' : 'bg-panel-1 text-ink'
            }`}
          >
            รวมบทความ
          </Link>
          {categories.docs.map((c: any) => (
            <Link
              key={c.id}
              href={`/article?category=${c.slug}`}
              className={`shrink-0 rounded-pill px-5 py-2 text-[15px] font-medium focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                activeCategory?.id === c.id ? 'bg-primary text-white' : 'bg-panel-1 text-ink'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {result.docs.map((post: any) => (
            <Link key={post.id} href={`/article/${post.category?.slug}/${post.slug}`} className="block">
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {post.featuredImage?.url && (
                  <ArticleImage src={post.featuredImage.url} alt={post.featuredImage.alt || ''} />
                )}
              </div>
              <h2 className="mt-3 line-clamp-2 font-bold text-primary">{post.title}</h2>
            </Link>
          ))}
          {result.docs.length === 0 && (
            <p className="col-span-full text-muted">ไม่พบบทความในหมวดหมู่นี้</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
