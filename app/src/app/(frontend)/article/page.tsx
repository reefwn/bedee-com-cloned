import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ArticleImage } from '@/blocks/components/ArticleImage'
import { ArticleBanner } from '@/blocks/components/ArticleBanner'

export const dynamic = 'force-dynamic'

type SearchParams = { category?: string; page?: string }

// cache() dedupes this against generateMetadata's identical lookup for the
// same request — same reasoning as every other page's getItem/getProduct.
const getCategories = cache(async () => {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'categories', sort: 'name', limit: 100 })
})

function buildPath(activeSlug: string | undefined, page: number) {
  const params = new URLSearchParams()
  if (activeSlug) params.set('category', activeSlug)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/article?${query}` : '/article'
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { category: activeSlug, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const categories = await getCategories()
  const activeCategory = activeSlug ? categories.docs.find((c) => c.slug === activeSlug) : undefined

  const title = activeCategory ? `บทความสุขภาพ: ${activeCategory.name} - BeDee` : 'บทความสุขภาพ - BeDee'
  const description = activeCategory
    ? `บทความสุขภาพหมวด ${activeCategory.name} จาก BeDee by BDMS`
    : 'บทความสุขภาพจาก BeDee by BDMS ครอบคลุมทุกหมวดหมู่สุขภาพ'
  const path = buildPath(activeSlug, page)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'website', url: path },
    twitter: { card: 'summary', title, description },
  }
}

export default async function ArticleListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { category: activeSlug, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const payload = await getPayload({ config })

  // Filtering posts by `category.slug` directly (a dot-path relationship
  // query) instead of first resolving the category doc's id lets all three
  // queries fire in one Promise.all instead of categories-then-posts.
  // That matters a lot here: Vercel's functions run in iad1 (US East) but
  // Supabase is ap-southeast-1 (Singapore), so every extra sequential round
  // trip costs ~250-400ms of pure cross-Pacific latency. depth:1 (not 2) is
  // also enough — only direct category/featuredImage relations are read,
  // never their own nested relations.
  const [categories, featured, result] = await Promise.all([
    getCategories(),
    payload.find({ collection: 'posts', sort: '-publishedAt', depth: 1, limit: 5 }),
    payload.find({
      collection: 'posts',
      sort: '-publishedAt',
      depth: 1,
      limit: 24,
      page,
      where: activeSlug ? { 'category.slug': { equals: activeSlug } } : undefined,
    }),
  ])
  const activeCategory = activeSlug ? categories.docs.find((c: any) => c.slug === activeSlug) : undefined
  const pageHref = (targetPage: number) => buildPath(activeSlug, targetPage)

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

        {result.totalPages > 1 && (
          <nav aria-label="สลับหน้าบทความ" className="mt-10 flex items-center justify-center gap-3">
            {result.hasPrevPage ? (
              <Link
                href={pageHref(page - 1)}
                className="rounded-pill bg-panel-1 px-5 py-2 text-[15px] font-medium text-ink focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
              >
                ‹ ก่อนหน้า
              </Link>
            ) : (
              <span className="rounded-pill px-5 py-2 text-[15px] font-medium text-muted opacity-50">‹ ก่อนหน้า</span>
            )}
            <span className="text-[15px] font-medium text-muted">
              หน้า {result.page} จาก {result.totalPages}
            </span>
            {result.hasNextPage ? (
              <Link
                href={pageHref(page + 1)}
                className="rounded-pill bg-primary px-5 py-2 text-[15px] font-medium text-white focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
              >
                หน้าถัดไป ›
              </Link>
            ) : (
              <span className="rounded-pill px-5 py-2 text-[15px] font-medium text-muted opacity-50">หน้าถัดไป ›</span>
            )}
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
