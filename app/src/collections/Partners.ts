import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name', group: 'Content', defaultColumns: ['name', 'sortOrder', 'url'] },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
