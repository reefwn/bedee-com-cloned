import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { rateLimitCreate } from '../hooks/rateLimitCreate'

// Public write, admin-only read — anyone can submit the contact form, only
// staff can see submissions. No email adapter is configured in this project
// (see payload.config.ts), so this collection IS the delivery mechanism —
// there is no real "and we'll also email you" happening behind the form.
const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Resolved', value: 'resolved' },
]

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    group: 'Content',
    defaultColumns: ['firstName', 'lastName', 'email', 'status', 'createdAt'],
  },
  access: { create: () => true, read: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    // Field-level access, not just collection-level — create is public (the
    // form itself), so without this a submitter could POST status:"resolved"
    // directly. defaultValue applies once the create-time value is blocked.
    {
      name: 'status',
      type: 'select',
      options: STATUS_OPTIONS,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      access: { create: isEditorOrAdmin, update: isEditorOrAdmin },
    },
    // Hidden form field — real submissions leave this empty; naive bots
    // that auto-fill every input don't. Rejected in beforeValidate below.
    { name: 'honeypot', type: 'text', admin: { hidden: true } },
    // Server-set in the rate-limit hook below — same pattern as sourceUrl
    // elsewhere (sidebar, readOnly, no field-level access gate since the
    // hook itself always overwrites it with the real detected IP).
    { name: 'ipAddress', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.honeypot) throw new Error('Submission rejected')
        return data
      },
      rateLimitCreate('contact-submissions'),
    ],
  },
}
