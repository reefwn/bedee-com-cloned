import { HeroCarousel } from './components/HeroCarousel'
import { IconGrid } from './components/IconGrid'
import { LogoStrip } from './components/LogoStrip'
import { ExpertTabs } from './components/ExpertTabs'
import { PromoBanner } from './components/PromoBanner'
import { ArticleGrid } from './components/ArticleGrid'
import { RichTextContent } from './components/RichTextContent'
import { FAQ } from './components/FAQ'
import { FAQIndex } from './components/FAQIndex'
import { ImageCarousel } from './components/ImageCarousel'
import { PromotionGrid } from './components/PromotionGrid'
import { ProductCarousel } from './components/ProductCarousel'
import { FeatureSteps } from './components/FeatureSteps'
import { TrustChecklist } from './components/TrustChecklist'
import { PromoStrip } from './components/PromoStrip'
import { StepsList } from './components/StepsList'
import { TestimonialGrid } from './components/TestimonialGrid'
import { CredentialStrip } from './components/CredentialStrip'
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
          return (
            <ExpertTabs
              key={i}
              heading={block.heading}
              doctors={block.doctors ?? []}
              defaultRole={block.defaultRole}
            />
          )
        case 'promoBanner':
          return (
            <PromoBanner
              key={i}
              heading={block.heading}
              body={block.body}
              image={block.image}
              badgeLabel={block.badgeLabel}
              variant={block.variant}
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
          return <ArticleGrid key={i} heading={block.heading} posts={result.docs as any} variant={block.variant} />
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
        case 'faqIndex':
          return (
            <FAQIndex
              key={i}
              heading={block.heading}
              intro={block.intro}
              updatedAt={block.updatedAt}
              safetyNotice={block.safetyNotice}
              quickLinks={block.quickLinks ?? []}
              priorityQuestions={block.priorityQuestions ?? []}
              categories={block.categories ?? []}
            />
          )
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
              ctaVariant={block.ctaVariant}
              ctaLabel={block.ctaLabel}
              ctaUrl={block.ctaUrl}
              secondaryCtaLabel={block.secondaryCtaLabel}
              secondaryCtaUrl={block.secondaryCtaUrl}
            />
          )
        case 'promoStrip':
          return (
            <PromoStrip
              key={i}
              icon={typeof block.icon === 'object' ? block.icon : null}
              kicker={block.kicker}
              heading={block.heading}
              body={block.body}
              ctaLabel={block.ctaLabel}
              ctaUrl={block.ctaUrl}
            />
          )
        case 'stepsList':
          return (
            <StepsList
              key={i}
              kicker={block.kicker}
              heading={block.heading}
              body={block.body}
              image={typeof block.image === 'object' ? block.image : null}
              items={block.items ?? []}
            />
          )
        case 'testimonialGrid': {
          const testimonials = (block.testimonials ?? []).filter(
            (t: any): t is object => typeof t === 'object',
          )
          return <TestimonialGrid key={i} kicker={block.kicker} heading={block.heading} testimonials={testimonials as any} />
        }
        case 'credentialStrip': {
          const items = (block.items ?? []).map((item: any) => ({
            image: typeof item.image === 'object' ? item.image : { url: null, alt: null },
            label: item.label,
            issuedBy: item.issuedBy,
            identifier: item.identifier,
            validFrom: item.validFrom,
            validUntil: item.validUntil,
            certificateUrl: item.certificateUrl,
          }))
          return (
            <CredentialStrip
              key={i}
              kicker={block.kicker}
              heading={block.heading}
              body={block.body}
              items={items}
            />
          )
        }
        default:
          return null
      }
    }),
  )

  return <>{rendered}</>
}
