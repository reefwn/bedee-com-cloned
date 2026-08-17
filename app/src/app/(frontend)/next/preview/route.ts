import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// Hit by each collection's admin.preview link. Same-origin as the admin
// panel, so the browser already sends the payload-token cookie — no
// separate preview secret needed, just a real authenticated session.
export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Unauthorized', { status: 401 })

  const url = new URL(req.url)
  const path = url.searchParams.get('path')
  if (!path || !path.startsWith('/')) return new Response('Invalid path', { status: 400 })

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
