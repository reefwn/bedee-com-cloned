import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Public write, admin-only read — anyone can submit the contact form, only
// staff can see submissions. No email adapter is configured in this project
// (see payload.config.ts), so this collection IS the delivery mechanism —
// there is no real "and we'll also email you" happening behind the form.
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: { useAsTitle: 'email', group: 'Content' },
  access: { create: () => true, read: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    // Hidden form field — real submissions leave this empty; naive bots
    // that auto-fill every input don't. Rejected in beforeValidate below.
    { name: 'honeypot', type: 'text', admin: { hidden: true } },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.honeypot) throw new Error('Submission rejected')
        return data
      },
    ],
  },
}
