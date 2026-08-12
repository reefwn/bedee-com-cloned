import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const footer = await payload.findGlobal({ slug: 'footer' })
const linkGroups = (footer.linkGroups ?? []) as { heading?: string | null; links?: { label?: string | null; url?: string | null }[] | null }[]

const legalGroup = linkGroups.find((g) => g.heading === 'กฏหมาย')
const link = legalGroup?.links?.find((l) => l.url === 'https://www.bedee.com/privacy-policy')
if (!link) throw new Error('privacy-policy footer link not found')
link.url = '/privacy-policy'

await payload.updateGlobal({ slug: 'footer', data: { linkGroups }, overrideAccess: true })
console.log('done')
process.exit(0)
