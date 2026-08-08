import { HeroCarousel } from './components/HeroCarousel'
import { IconGrid } from './components/IconGrid'
import { LogoStrip } from './components/LogoStrip'
import { ExpertTabs } from './components/ExpertTabs'
import { PromoBanner } from './components/PromoBanner'
import { ArticleGrid } from './components/ArticleGrid'
import { RichTextContent } from './components/RichTextContent'
import { FAQ } from './components/FAQ'
import { ImageCarousel } from './components/ImageCarousel'
import { getPayload } from 'payload'
import config from '@payload-config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null
  const payload = await getPayload({ config })

  const rendered = await Promise.all(
    blocks.map(async (block, i) => {
      switch (block.blockType) {
        case 'heroCarousel':
          return <HeroCarousel key={i} slides={block.slides} variant={block.variant} />
        case 'iconGrid':
          return (
            <IconGrid
              key={i}
              heading={block.heading}
              items={block.items}
              variant={block.variant}
            />
          )
        case 'logoStrip':
          return <LogoStrip key={i} heading={block.heading} partners={block.partners ?? []} />
        case 'expertTabs':
          return <ExpertTabs key={i} heading={block.heading} doctors={block.doctors ?? []} />
        case 'promoBanner':
          return (
            <PromoBanner
              key={i}
              heading={block.heading}
              body={block.body}
              image={block.image}
              badgeLabel={block.badgeLabel}
              ctaLabel={block.ctaLabel}
              ctaUrl={block.ctaUrl}
            />
          )
        case 'articleGrid': {
          const result = await payload.find({
            collection: 'posts',
            limit: block.postCount ?? 3,
            sort: '-publishedAt',
            depth: 2,
            where: block.categorySlug
              ? { 'category.slug': { equals: block.categorySlug } }
              : undefined,
          })
          return <ArticleGrid key={i} heading={block.heading} posts={result.docs as any} />
        }
        case 'imageCarousel': {
          const images = (block.images ?? []).map((item: any) =>
            typeof item.image === 'object' ? item.image : { url: null, alt: null },
          )
          return <ImageCarousel key={i} heading={block.heading} images={images} />
        }
        case 'richTextContent':
          return <RichTextContent key={i} heading={block.heading} content={block.content} />
        case 'faq':
          return <FAQ key={i} heading={block.heading} items={block.items ?? []} />
        default:
          return null
      }
    }),
  )

  return <>{rendered}</>
}
