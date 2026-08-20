import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Added per task brief — NOT present on the source site (bedee.com carries trust via
// hospital-network logos + named doctor cards, not customer quotes). See
// plans/02-brand-interview.md §12 for the flag. Recommended placement: service pages.
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'authorName', group: 'Content', defaultColumns: ['authorName', 'relatedService'] },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'authorName', type: 'text', required: true, localized: true },
    { name: 'authorPhoto', type: 'upload', relationTo: 'media' },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'relatedService', type: 'relationship', relationTo: 'services' },
    // Real customer-survey data (Compliment for Customer Survey.xlsx) — the
    // survey's own top-level category (delivery vs teleconsult), kept as-is
    // rather than re-derived from transaction prefixes some rows disagree
    // with (e.g. a couple "teleconsult"-coded rows are actually about a
    // pharmacist) — the source's own label, not our guess.
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Product & Delivery', value: 'delivery' },
        { label: 'Teleconsultation / Telepharmacy', value: 'teleconsult' },
      ],
    },
    { name: 'submittedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
  ],
}
