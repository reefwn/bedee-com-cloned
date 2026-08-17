import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// teleconsultation / telepharmacy / health-mall — mirrors the section pattern observed
// on /teleconsultation in plans/01-site-dna.md: intro, why-choose-us, steps, benefits,
// featured doctors, suitable symptoms, related promotions/posts.
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: (doc) => `/next/preview?path=${encodeURIComponent(`/${doc.slug}`)}`,
  },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'intro', type: 'richText', editor: lexicalEditor(), localized: true },
    {
      name: 'whyChooseUs',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'stepNumber', type: 'number' },
        { name: 'label', type: 'text', localized: true },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'label', type: 'text', localized: true }],
    },
    {
      name: 'suitableSymptoms',
      type: 'array',
      fields: [{ name: 'label', type: 'text', localized: true }],
    },
    { name: 'featuredDoctors', type: 'relationship', relationTo: 'doctors', hasMany: true },
    { name: 'relatedPromotions', type: 'relationship', relationTo: 'promotions', hasMany: true },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
    // AI SEO: structured pricing so AI shopping agents can read tiers without
    // parsing prose — feeds the /pricing.md route. See ai-seo skill.
    {
      name: 'pricing',
      type: 'array',
      fields: [
        { name: 'tierLabel', type: 'text', required: true, localized: true },
        { name: 'price', type: 'number', required: true },
        { name: 'currency', type: 'text', defaultValue: 'THB' },
        { name: 'durationMinutes', type: 'number' },
        { name: 'notes', type: 'text', localized: true },
      ],
    },
    // AI SEO: self-contained Q&A pairs, rendered with FAQPage schema.
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
