import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// teleconsultation / telepharmacy / health-mall — mirrors the section pattern observed
// on /teleconsultation in plans/01-site-dna.md: intro, why-choose-us, steps, benefits,
// featured doctors, suitable symptoms, related promotions/posts.
export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', group: 'Content' },
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
  ],
}
