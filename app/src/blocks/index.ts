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
      maxRows: 4,
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

export const BlocksField = [
  HeroCarouselBlock,
  IconGridBlock,
  LogoStripBlock,
  ExpertTabsBlock,
  PromoBannerBlock,
  ArticleGridBlock,
  RichTextContentBlock,
  FAQBlock,
]
