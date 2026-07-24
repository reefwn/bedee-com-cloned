import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { 'category.slug': { equals: category } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  const post = result.docs[0]

  if (!post) notFound()

  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-semibold leading-tight text-[#081F7C]">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-[#666]">{post.excerpt}</p> : null}
        {image?.url ? (
          // The migrated source image dimensions vary, so preserve their natural ratio.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="my-8 w-full rounded-2xl" src={image.url} alt={image.alt ?? post.title} />
        ) : null}
        {post.content ? (
          <RichText
            className="space-y-5 leading-8 text-[#222] [&_a]:text-[#317DF5] [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#081F7C] [&_h3]:pt-3 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc"
            data={post.content}
          />
        ) : null}
      </main>
      <SiteFooter />
    </>
  )
}
