import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Link-out model (option (a) in plans/payload-content-model.md §1): shop.bedee.com
// remains the real storefront/checkout. This collection is marketing copy + imagery
// for the health-mall promo section, not a real inventory/checkout system.
export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'price', type: 'number', admin: { description: 'Display-only — checkout happens on shop.bedee.com' } },
    // Optional — set alongside `price` when the source shows a discount
    // (e.g. health-plaza's "Hot Deal" packages: struck-through list price
    // next to the real discounted price).
    { name: 'originalPrice', type: 'number' },
    { name: 'externalUrl', type: 'text', required: true },
  ],
}
