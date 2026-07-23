import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true, update: isEditorOrAdmin },
  fields: [
    { name: 'tagline', type: 'textarea', localized: true },
    {
      name: 'linkGroups',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['facebook', 'line', 'instagram'],
        },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
