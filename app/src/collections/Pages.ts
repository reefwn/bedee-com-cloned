import type { CollectionConfig } from 'payload'
import { BlocksField } from '../blocks'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: (doc) => {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      return `/next/preview?path=${encodeURIComponent(path)}`
    },
  },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'sourceUrl',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'layout', type: 'blocks', blocks: BlocksField, localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
      ],
    },
  ],
}
