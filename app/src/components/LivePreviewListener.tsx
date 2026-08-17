'use client'

import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'

// Mounted only when draft mode is on (i.e. only during an actual preview
// session via /next/preview) — listens for postMessage from the admin
// panel's Live Preview iframe and re-runs the server component fetch on
// every edit. Same-origin app (admin + frontend share one Next.js
// deployment), so window.location.origin is always the right serverURL.
export function LivePreviewListener() {
  const router = useRouter()
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={typeof window !== 'undefined' ? window.location.origin : ''}
    />
  )
}
