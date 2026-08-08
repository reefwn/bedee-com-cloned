// AI SEO: HowTo schema for any real numbered-step list already present in a
// page's richTextContent — see ai-seo skill. Generic across pages (not
// teleconsultation-specific): any page whose content has an <ol> preceded by
// a heading gets a HowTo block for free, sourced from real migrated copy,
// never fabricated.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textOf(node: any): string {
  if (!node?.children) return ''
  return node.children.map((c: any) => (c.type === 'text' ? c.text : textOf(c))).join('')
}

export type HowToSchema = {
  '@context': 'https://schema.org'
  '@type': 'HowTo'
  name: string
  step: { '@type': 'HowToStep'; position: number; text: string }[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractHowToSchemas(layout: any[]): HowToSchema[] {
  const schemas: HowToSchema[] = []

  for (const block of layout ?? []) {
    if (block.blockType !== 'richTextContent') continue
    const children = block.content?.root?.children ?? []
    let precedingHeading = ''

    for (const node of children) {
      if (node.type === 'heading') {
        precedingHeading = textOf(node)
        continue
      }
      if (node.type === 'list' && node.tag === 'ol' && precedingHeading) {
        const steps = (node.children ?? []).map((item: any, i: number) => ({
          '@type': 'HowToStep' as const,
          position: i + 1,
          text: textOf(item),
        }))
        if (steps.length) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: precedingHeading,
            step: steps,
          })
        }
      }
    }
  }

  return schemas
}
