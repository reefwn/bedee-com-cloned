import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

// Always reads live from Payload/Postgres — never statically prerendered.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const homeResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 2,
    limit: 1,
  })

  const home = homeResult.docs[0]

  return (
    <>
      <SiteHeader />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {home?.layout ? <RenderBlocks blocks={home.layout as any[]} /> : (
        <main className="p-16 text-center text-muted">
          No <code>home</code> page document found yet — create one in{' '}
          <a className="underline" href="/admin/collections/pages">
            /admin/collections/pages
          </a>{' '}
          with slug &quot;home&quot; and add the section blocks.
        </main>
      )}
      <SiteFooter />
    </>
  )
}
