import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true, update: isEditorOrAdmin },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
  ],
}
