import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ArticleImage } from '@/blocks/components/ArticleImage'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://bedee-payload.vercel.app'

// cache() dedupes this against generateMetadata's identical lookup for the
// same request — same reasoning as the [slug] pages' getItem/getPost.
const getPageResult = cache(async (page: number) => {
  const payload = await getPayload({ config })
  return payload.find({
    collection: 'news-and-activities',
    sort: '-publishedAt',
    depth: 1,
    limit: 12,
    page,
  })
})

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const result = await getPageResult(page)

  const title =
    page > 1 ? `ข่าวสารและกิจกรรม (หน้า ${page}/${result.totalPages}) - BeDee` : 'ข่าวสารและกิจกรรม - BeDee'
  const description = 'ข่าวประชาสัมพันธ์และกิจกรรมล่าสุดจาก BeDee by BDMS'
  const path = page > 1 ? `/news-activities?page=${page}` : '/news-activities'

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'website', url: path },
    twitter: { card: 'summary', title, description },
  }
}

// Mirrors /article/page.tsx's real pagination pattern (Payload's own
// page/limit, not client-side slicing) — minus the category filter and
// banner carousel, since NewsAndActivities has neither a category field nor
// enough volume to warrant one, matching the source's own simpler listing.
export default async function NewsActivitiesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const result = await getPageResult(page)

  const pageHref = (targetPage: number) => (targetPage > 1 ? `/news-activities?page=${targetPage}` : '/news-activities')

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ข่าวสารและกิจกรรม',
    itemListElement: result.docs.map((item, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * 12 + i + 1,
      url: `${SITE_URL}/news-activities/${item.slug}`,
      name: item.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-[28px] font-semibold text-primary">ข่าวสารและกิจกรรม</h1>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {result.docs.map((item) => {
            const image = typeof item.featuredImage === 'object' ? item.featuredImage : null
            return (
              <Link
                key={item.id}
                href={`/news-activities/${item.slug}`}
                className="block focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
              >
                <div className="relative aspect-video overflow-hidden bg-panel-1">
                  {image?.url && <ArticleImage src={image.url} alt={image.alt || item.title} />}
                </div>
                <h2 className="mt-3 line-clamp-2 font-semibold text-primary">{item.title}</h2>
                {item.publishedAt && (
                  <p className="mt-1 text-sm text-muted">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</p>
                )}
                {item.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{item.excerpt}</p>}
              </Link>
            )
          })}
          {result.docs.length === 0 && <p className="col-span-full text-muted">ไม่พบข่าวสารและกิจกรรม</p>}
        </div>

        {result.totalPages > 1 && (
          <nav aria-label="สลับหน้าข่าวสารและกิจกรรม" className="mt-10 flex items-center justify-center gap-3">
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
