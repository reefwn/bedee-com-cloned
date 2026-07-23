import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ category: string; slug: string }> }

export default async function ArticleDetailPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const post = result.docs[0] as any
  if (!post) notFound()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-[32px] font-semibold text-primary">{post.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {post.author?.name} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('th-TH') : ''}
        </p>
        <div className="prose mt-8 max-w-none">
          <RichText data={post.content} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
