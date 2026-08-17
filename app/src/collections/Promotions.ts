import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'validFrom', 'validUntil'] },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'banner', type: 'upload', relationTo: 'media', required: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    { name: 'ctaUrl', type: 'text' },
  ],
}
