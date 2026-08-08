import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

function listItem(children: any[], value: number) {
  return {
    type: 'listitem',
    version: 1,
    value,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children,
  }
}

function list(tag: 'ul' | 'ol', items: any[]) {
  return {
    type: 'list',
    version: 1,
    tag,
    listType: tag === 'ul' ? ('bullet' as const) : ('number' as const),
    start: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: items,
  }
}

function stripPrefix(text: string, re: RegExp) {
  return text.replace(re, '')
}

function paragraphChildrenWithStrippedFirst(children: any[], re: RegExp) {
  return children.map((c: any, i: number) =>
    i === 0 && c.type === 'text' ? { ...c, text: stripPrefix(c.text, re) } : c,
  )
}

const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'teleconsultation' } }, limit: 1 })).docs[0]
const layout = page.layout as any[]
const richText1 = layout[1]
const rootChildren = richText1.content.root.children as any[]

// Bullet block: indices 7-18 (disease-category list under "ทำไมต้องปรึกษาหมอออนไลน์กับ BeDee")
const bulletStart = rootChildren.findIndex((c) =>
  (c.children ?? []).some((cc: any) => typeof cc.text === 'string' && cc.text.startsWith('• กลุ่มโรคทางสุขภาพใจ')),
)
const bulletEnd = rootChildren.findIndex((c) =>
  (c.children ?? []).some((cc: any) => typeof cc.text === 'string' && cc.text.startsWith('• การดูแลประคับประคองตามอาการ')),
)
if (bulletStart === -1 || bulletEnd === -1) throw new Error('bullet range not found')

const bulletItems = rootChildren
  .slice(bulletStart, bulletEnd + 1)
  .map((c, i) => listItem(paragraphChildrenWithStrippedFirst(c.children, /^•\s*/), i + 1))
const bulletList = list('ul', bulletItems)

// Numbered block: the 5 steps under "ขั้นตอนปรึกษาหมอออนไลน์กับ BeDee"
const stepStart = rootChildren.findIndex((c) =>
  (c.children ?? []).some((cc: any) => typeof cc.text === 'string' && cc.text.startsWith('1. ดาวน์โหลดแอป BeDee')),
)
const stepEnd = rootChildren.findIndex((c) =>
  (c.children ?? []).some((cc: any) => typeof cc.text === 'string' && cc.text.startsWith('5. รับคำปรึกษา')),
)
if (stepStart === -1 || stepEnd === -1) throw new Error('step range not found')

const stepItems = rootChildren
  .slice(stepStart, stepEnd + 1)
  .map((c, i) => listItem(paragraphChildrenWithStrippedFirst(c.children, /^\d+\.\s*/), i + 1))
const stepList = list('ol', stepItems)

// Splice numbered block first (higher index) so bullet-block indices stay valid.
const withSteps = [...rootChildren.slice(0, stepStart), stepList, ...rootChildren.slice(stepEnd + 1)]
const withBoth = [...withSteps.slice(0, bulletStart), bulletList, ...withSteps.slice(bulletEnd + 1)]

const newRichText1 = { ...richText1, content: { ...richText1.content, root: { ...richText1.content.root, children: withBoth } } }
const newLayout = [...layout]
newLayout[1] = newRichText1

await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout }, overrideAccess: true })
console.log('done')
process.exit(0)
