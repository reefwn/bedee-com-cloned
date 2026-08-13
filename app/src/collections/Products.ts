import type { CollectionConfig, Field } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Bullet-list field used for the detail page's "properties / ingredients /
// dosage / warnings" sections — same shape 4x, so factored once.
const bulletList = (name: string): Field => ({
  name,
  type: 'array',
  localized: true,
  fields: [{ name: 'text', type: 'text', required: true }],
})

// Link-out model (option (a) in plans/payload-content-model.md §1): shop.bedee.com
// remains the real storefront/checkout. This collection is marketing copy + imagery
// for the health-mall promo section, not a real inventory/checkout system. The
// `slug`/gallery/description/bullet-list fields below back an in-house product
// detail page (health-mall products only); `externalUrl` stays the real
// shop-now / source-of-truth link even once a product has a detail page.
export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'shortDescription', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    bulletList('highlights'),
    bulletList('keyIngredients'),
    bulletList('usage'),
    bulletList('warnings'),
    // Real pharmacist Q&A from the source page's own "คำถามที่พบบ่อย" section
    // (17 of 39 products have it) — renders as an FAQ block and backs
    // FAQPage schema on the product detail page.
    {
      name: 'faqs',
      type: 'array',
      localized: true,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'price', type: 'number', admin: { description: 'Display-only — checkout happens on shop.bedee.com' } },
    // Optional — set alongside `price` when the source shows a discount
    // (e.g. health-plaza's "Hot Deal" packages: struck-through list price
    // next to the real discounted price).
    { name: 'originalPrice', type: 'number' },
    { name: 'externalUrl', type: 'text', required: true },
  ],
}
