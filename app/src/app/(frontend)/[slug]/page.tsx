import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  const page = result.docs[0]

  if (!page) notFound()

  return (
    <>
      <SiteHeader />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RenderBlocks blocks={(page.layout ?? []) as any[]} />
      <SiteFooter />
    </>
  )
}
