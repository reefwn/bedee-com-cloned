import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt'], group: 'Content' },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', editor: lexicalEditor(), localized: true },
    { name: 'author', type: 'relationship', relationTo: 'doctors' },
    { name: 'viewCount', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true, maxRows: 4 },
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
