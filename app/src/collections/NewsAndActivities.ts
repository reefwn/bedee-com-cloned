import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Distinct from `posts` (health articles) — company/PR news, separate nav item and
// URL on the source site (/news-and-activities). Do not merge into Posts.
export const NewsAndActivities: CollectionConfig = {
  slug: 'news-and-activities',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'publishedAt', 'updatedAt'],
    preview: (doc) => `/next/preview?path=${encodeURIComponent(`/news-activities/${doc.slug}`)}`,
  },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', editor: lexicalEditor(), localized: true },
    { name: 'publishedAt', type: 'date' },
  ],
}
