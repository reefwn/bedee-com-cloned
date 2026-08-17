import type { CollectionBeforeValidateHook } from 'payload'

const WINDOW_MS = 60 * 60 * 1000
const MAX_SUBMISSIONS_PER_WINDOW = 3

// Vercel's edge sets x-forwarded-for as "client, proxy1, proxy2" — the
// first entry is the real client. Falls back to x-real-ip for other hosts.
function getClientIp(headers: Request['headers']): string | null {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || null
  return headers.get('x-real-ip')
}

// Interim measure while a CAPTCHA provider is chosen — honeypot alone
// doesn't stop a script that fills every field. Counts this collection's
// own recent docs by IP rather than a separate store, since it's a public-
// create collection anyway and Postgres is the only durable store already
// wired up (Vercel serverless has no reliable shared in-memory state).
export function rateLimitCreate(collectionSlug: string): CollectionBeforeValidateHook {
  return async ({ req, operation, data }) => {
    if (operation !== 'create') return data

    const ip = getClientIp(req.headers)
    // Can't identify the requester — fail open rather than block real
    // submitters on a missing/stripped header.
    if (!ip) return data

    const since = new Date(Date.now() - WINDOW_MS).toISOString()
    const { totalDocs } = await req.payload.count({
      collection: collectionSlug as never,
      where: { and: [{ ipAddress: { equals: ip } }, { createdAt: { greater_than: since } }] },
    })

    if (totalDocs >= MAX_SUBMISSIONS_PER_WINDOW) {
      throw new Error('Too many submissions from this address — please try again later.')
    }

    return { ...data, ipAddress: ip }
  }
}
