import { getPayload } from 'payload'
import config from '../src/payload.config'

// AI SEO fix: /llms.txt's shortDescription was empty, so the file had zero
// brand-summary context before diving into link lists. Reusing the
// homepage's real, already-shipped meta description rather than inventing
// new copy — see src/app/(frontend)/page.tsx's DESCRIPTION constant.
const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    shortDescription: 'ปรึกษาหมอออนไลน์ ปรึกษาเภสัชกร ส่งยา — Powered by BDMS',
  },
})

console.log('site-settings.shortDescription set.')
process.exit(0)
