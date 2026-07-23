import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function ArticleListPage() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    depth: 2,
    limit: 24,
  })

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-[28px] font-semibold text-primary">บทความสุขภาพ</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {result.docs.map((post: any) => (
            <Link key={post.id} href={`/article/${post.category?.slug}/${post.slug}`} className="block">
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {post.featuredImage?.url && (
                  <Image src={post.featuredImage.url} alt={post.featuredImage.alt || ''} fill className="object-cover" />
                )}
              </div>
              <h2 className="mt-3 line-clamp-2 font-bold text-primary">{post.title}</h2>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
