import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Doctor', value: 'doctor' },
        { label: 'Pharmacist', value: 'pharmacist' },
      ],
    },
    { name: 'specialty', type: 'text', localized: true },
    { name: 'hospital', type: 'relationship', relationTo: 'partners' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
