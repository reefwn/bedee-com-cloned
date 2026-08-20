import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// One block per homepage section identified in plans/01-site-dna.md §1.1 and
// specced in plans/03-replication-prompt.md §3. Lets editors rebuild/reorder the
// homepage without a code deploy — the source Elementor build cannot do this.

export const HeroCarouselBlock: Block = {
  slug: 'heroCarousel',
  labels: { singular: 'Hero Carousel', plural: 'Hero Carousels' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (navy->blue gradient, white text) — homepage default', value: 'dark' },
        { label: 'Light (pale blue gradient, dark text, coral CTA)', value: 'light' },
        { label: 'Coral (real source background photo, dark text)', value: 'coral' },
        { label: 'Teal (real source background photo, dark text)', value: 'teal' },
      ],
    },
    // Set alongside a "photo" variant (coral, teal, ...) — the source page's
    // hero band is a real background photo (e.g. health-mall's coral
    // wavy-line texture, telepharmacy's teal one), not a flat CSS gradient
    // like the dark/light variants.
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'headline', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        { name: 'ctaUrl', type: 'text' },
      ],
    },
  ],
}

export const IconGridBlock: Block = {
  slug: 'iconGrid',
  labels: { singular: 'Icon Grid', plural: 'Icon Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'tinted',
      options: [
        { label: 'Tinted background', value: 'tinted' },
        { label: 'White background', value: 'plain' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const LogoStripBlock: Block = {
  slug: 'logoStrip',
  labels: { singular: 'Logo Strip', plural: 'Logo Strips' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: true },
  ],
}

export const ExpertTabsBlock: Block = {
  slug: 'expertTabs',
  labels: { singular: 'Expert Tabs', plural: 'Expert Tabs' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'doctors', type: 'relationship', relationTo: 'doctors', hasMany: true },
  ],
}

export const PromoBannerBlock: Block = {
  slug: 'promoBanner',
  labels: { singular: 'Promo Banner', plural: 'Promo Banners' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'badgeLabel', type: 'text', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaUrl', type: 'text' },
    // Optional — e.g. health-mall's own version of this banner has a second
    // "ช้อปอะไรได้บ้างใน Health Mall" line plus a compact category-icon row
    // inside the same text column, not a full-width section of its own.
    { name: 'subheading', type: 'text', localized: true },
    {
      name: 'iconItems',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

export const ArticleGridBlock: Block = {
  slug: 'articleGrid',
  labels: { singular: 'Article Grid', plural: 'Article Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'postCount', type: 'number', defaultValue: 3 },
    // Optional — omit to keep the existing "latest across the whole site"
    // behavior. Set to pin a specific category's latest posts instead (e.g.
    // a service page's "related articles" section).
    { name: 'categorySlug', type: 'text' },
  ],
}

export const ImageCarouselBlock: Block = {
  slug: 'imageCarousel',
  labels: { singular: 'Image Carousel', plural: 'Image Carousels' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const PromotionGridBlock: Block = {
  slug: 'promotionGrid',
  labels: { singular: 'Promotion Grid', plural: 'Promotion Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    // Explicit picks, not "latest N" — which promotions apply to a given
    // page is curated per-page (e.g. only 5 of the 12 site-wide promotions
    // are relevant to /teleconsultation), not simply chronological.
    { name: 'promotions', type: 'relationship', relationTo: 'promotions', hasMany: true },
  ],
}

export const ProductCarouselBlock: Block = {
  slug: 'productCarousel',
  labels: { singular: 'Product Carousel', plural: 'Product Carousels' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    // Optional — the source pairs this heading with a small bag icon (e.g.
    // health-mall's "สินค้าสุขภาพ" section); omit for a plain text heading.
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
  ],
}

export const RichTextContentBlock: Block = {
  slug: 'richTextContent',
  labels: { singular: 'Rich Text Content', plural: 'Rich Text Content' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
      localized: true,
    },
  ],
}

// AI SEO: FAQPage-schema-eligible content — each item is a self-contained
// 40-60 word answer block, extractable by AI search without surrounding
// context. See plans/payload-content-model.md and app/src/blocks/components/FAQ.tsx.
export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

// From revise-website.pptx slide 1 (image4.png, full-res) — "ONE APP,
// COMPLETE CARE" section: kicker + 2-line heading + intro copy, then a row
// of feature cards. View/hover only — no CTA — so each card needs its own
// icon (asset-homepage) rather than a derived step number to carry meaning.
export const FeatureStepsBlock: Block = {
  slug: 'featureSteps',
  labels: { singular: 'Feature Steps', plural: 'Feature Steps' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (white bg, navy text) — homepage default', value: 'light' },
        { label: 'Dark (navy bg, white text)', value: 'dark' },
      ],
    },
    { name: 'kicker', type: 'text', localized: true },
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}

// From revise-website.pptx slide 2 (image20.png, full-res) — "CARE YOU CAN
// TRUST": kicker + 2-line heading + intro copy on one side, a real team
// photo with a floating credential badge on the other, then a numbered
// (order-meaningful, hence <ol> in the component) 3-step process list and
// a secondary/outline CTA — the real bedee.com site's own secondary-button
// style (confirmed against the hero's full-res source, image3.png).
export const TrustChecklistBlock: Block = {
  slug: 'trustChecklist',
  labels: { singular: 'Trust Checklist', plural: 'Trust Checklists' },
  fields: [
    { name: 'kicker', type: 'text', localized: true },
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'imageBadgeLabel', type: 'text', localized: true },
    { name: 'imageBadgeSub', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'ctaVariant',
      type: 'select',
      defaultValue: 'outline',
      options: [
        { label: 'Outline (white bg, navy border) — "CARE YOU CAN TRUST" default', value: 'outline' },
        { label: 'Solid (navy bg, white text)', value: 'solid' },
      ],
    },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaUrl', type: 'text' },
    // Optional — slide 3's telepharmacy instance of this section pairs a
    // solid primary CTA with a second plain-text link ("ช้อปสินค้าสุขภาพ");
    // the "CARE YOU CAN TRUST" instance has neither.
    { name: 'secondaryCtaLabel', type: 'text', localized: true },
    { name: 'secondaryCtaUrl', type: 'text' },
  ],
}

// From revise-website.pptx slide 3 (image30.png, full-res) — "INSURANCE MADE
// EASIER". A single-row gradient banner, not the two-column layout every
// other section here uses. Reuses the hero's own navy->blue gradient token
// rather than introducing a new one — DESIGN.md reserves gradients for the
// hero, but this is real evidence of the same token appearing in a second
// real context, not a new color decision.
export const PromoStripBlock: Block = {
  slug: 'promoStrip',
  labels: { singular: 'Promo Strip', plural: 'Promo Strips' },
  fields: [
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'kicker', type: 'text', localized: true },
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaUrl', type: 'text' },
  ],
}

// From revise-website.pptx slide 4 (image32/33.png, full-res) — "HOW IT
// WORKS". A third distinct list treatment (after TrustChecklist's numbered
// <ol> and FeatureSteps' icon cards): plain hairline-divided rows, no card
// bg, no number badge — just a muted digit. image34.png (the real BeDee app
// screenshot, dual-phone mockup with the site's own accent-blob motif
// already baked into the asset) sits beside the step rows.
export const StepsListBlock: Block = {
  slug: 'stepsList',
  labels: { singular: 'Steps List', plural: 'Steps Lists' },
  fields: [
    { name: 'kicker', type: 'text', localized: true },
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const BlocksField = [
  HeroCarouselBlock,
  IconGridBlock,
  LogoStripBlock,
  ExpertTabsBlock,
  PromoBannerBlock,
  ArticleGridBlock,
  ImageCarouselBlock,
  PromotionGridBlock,
  ProductCarouselBlock,
  RichTextContentBlock,
  FAQBlock,
  FeatureStepsBlock,
  TrustChecklistBlock,
  PromoStripBlock,
  StepsListBlock,
]
