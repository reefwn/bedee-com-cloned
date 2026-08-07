import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// One-off follow-up to backfill-child-health-checkup-kit.ts: the inline
// body image between the "ตรวจสุขภาพเด็กตามวัยควรตรวจอะไรบ้าง ?" heading and
// its first h3 was never migrated — confirmed zero posts across the whole
// site have any inline "upload" lexical node, so the WP parser dropped
// inline content images entirely (likely affects other articles too).
// Sourced verbatim from https://www.bedee.com/articles/wellness/child-health-checkup-kit
// (data-lazy-src on the img with alt="โปรแกรมตรวจสุขภาพเด็ก").

const IMAGE_URL =
  'https://www.bedee.com/wp-content/uploads/2025/10/child-health-checkup-program.jpg'
const ALT = 'โปรแกรมตรวจสุขภาพเด็ก'
const HEADING_TEXT = 'ตรวจสุขภาพเด็กตามวัยควรตรวจอะไรบ้าง ?'

const payload = await getPayload({ config })

const response = await fetch(IMAGE_URL, { signal: AbortSignal.timeout(30_000) })
if (!response.ok) throw new Error(`${IMAGE_URL} returned HTTP ${response.status}`)
const buffer = Buffer.from(await response.arrayBuffer())

const media = await payload.create({
  collection: 'media',
  data: { alt: ALT },
  file: {
    data: new Uint8Array(buffer),
    mimetype: response.headers.get('content-type') || 'image/jpeg',
    name: 'child-health-checkup-program.jpg',
    size: buffer.length,
  },
  overrideAccess: true,
})

const result = await payload.find({
  collection: 'posts',
  where: { slug: { equals: 'child-health-checkup-kit' } },
  limit: 1,
})
const post = result.docs[0]
if (!post) throw new Error('post not found')
if (!post.content) throw new Error('post has no content')

const headingIndex = post.content.root.children.findIndex(
  (c: any) => c.type === 'heading' && c.children?.[0]?.text === HEADING_TEXT,
)
if (headingIndex === -1) throw new Error('target heading not found')

const uploadNode = {
  type: 'upload',
  version: 3,
  format: '',
  id: randomBytes(12).toString('hex'),
  relationTo: 'media',
  value: media.id,
  fields: null,
}

const children = [...post.content.root.children]
children.splice(headingIndex + 1, 0, uploadNode)

await payload.update({
  collection: 'posts',
  id: post.id,
  data: { content: { ...post.content, root: { ...post.content.root, children } } },
  overrideAccess: true,
})

console.log('Uploaded media', media.id, 'and inserted at index', headingIndex + 1)
process.exit(0)
