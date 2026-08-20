import { HeroCarousel } from './components/HeroCarousel'
import { IconGrid } from './components/IconGrid'
import { LogoStrip } from './components/LogoStrip'
import { ExpertTabs } from './components/ExpertTabs'
import { PromoBanner } from './components/PromoBanner'
import { ArticleGrid } from './components/ArticleGrid'
import { RichTextContent } from './components/RichTextContent'
import { FAQ } from './components/FAQ'
import { ImageCarousel } from './components/ImageCarousel'
import { PromotionGrid } from './components/PromotionGrid'
import { ProductCarousel } from './components/ProductCarousel'
import { FeatureSteps } from './components/FeatureSteps'
import { TrustChecklist } from './components/TrustChecklist'
import { getPayload } from 'payload'
import config from '@payload-config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function RenderBlocks({
  blocks,
  heroHeadingLevel = 'h1',
}: {
  blocks: any[]
  heroHeadingLevel?: 'h1' | 'h2'
}) {
  if (!blocks?.length) return null
  const payload = await getPayload({ config })

  const rendered = await Promise.all(
    blocks.map(async (block, i) => {
      switch (block.blockType) {
        case 'heroCarousel':
          return (
            <HeroCarousel
              key={i}
              slides={block.slides}
              variant={block.variant}
              backgroundImage={typeof block.backgroundImage === 'object' ? block.backgroundImage : null}
              headingLevel={heroHeadingLevel}
            />
          )
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
              subheading={block.subheading}
              iconItems={(block.iconItems ?? []).map((item: any) => ({
                icon: typeof item.icon === 'object' ? item.icon : { url: null, alt: null },
                label: item.label,
              }))}
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
        case 'promotionGrid': {
          const promos = (block.promotions ?? []).filter(
            (p: any): p is object => typeof p === 'object',
          )
          return <PromotionGrid key={i} heading={block.heading} promotions={promos as any} />
        }
        case 'productCarousel': {
          const products = (block.products ?? []).filter(
            (p: any): p is object => typeof p === 'object',
          )
          return (
            <ProductCarousel
              key={i}
              heading={block.heading}
              icon={typeof block.icon === 'object' ? block.icon : null}
              products={products as any}
            />
          )
        }
        case 'richTextContent':
          return <RichTextContent key={i} heading={block.heading} content={block.content} />
        case 'faq':
          return <FAQ key={i} heading={block.heading} items={block.items ?? []} />
        case 'featureSteps':
          return (
            <FeatureSteps
              key={i}
              kicker={block.kicker}
              heading={block.heading}
              description={block.description}
              variant={block.variant}
              items={(block.items ?? []).map((item: any) => ({
                icon: typeof item.icon === 'object' ? item.icon : { url: null, alt: null },
                title: item.title,
                description: item.description,
              }))}
            />
          )
        case 'trustChecklist':
          return (
            <TrustChecklist
              key={i}
              kicker={block.kicker}
              heading={block.heading}
              body={block.body}
              image={typeof block.image === 'object' ? block.image : { url: null, alt: null }}
              imageBadgeLabel={block.imageBadgeLabel}
              imageBadgeSub={block.imageBadgeSub}
              items={block.items ?? []}
              ctaLabel={block.ctaLabel}
              ctaUrl={block.ctaUrl}
            />
          )
        default:
          return null
      }
    }),
  )

  return <>{rendered}</>
}
