import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ServiceDetail } from '@/components/ServiceDetail'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  const page = pageResult.docs[0]

  if (page) {
    return (
      <>
        <SiteHeader />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RenderBlocks blocks={(page.layout ?? []) as any[]} />
        <SiteFooter />
      </>
    )
  }

  // Live site serves service pages (teleconsultation, telepharmacy,
  // health-mall) at this same flat top-level slug — see
  // plans/01-site-dna.md §1.8. Fall back to `services` before 404ing.
  const serviceResult = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  const service = serviceResult.docs[0]

  if (!service) notFound()

  return (
    <>
      <SiteHeader />
      <ServiceDetail service={service} />
      <SiteFooter />
    </>
  )
}
