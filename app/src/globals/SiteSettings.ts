import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// AI SEO: brand facts AI systems can cite verbatim — a sharp, dated stat
// ("500+ doctors") beats vague copy ("wide network of doctors") for citation
// share. Also feeds /llms.txt. Keep `asOf` current — stale stats read as
// less trustworthy than no stat. See ai-seo skill audit findings.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: isEditorOrAdmin },
  fields: [
    { name: 'tagline', type: 'text', localized: true },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: { description: '1-2 sentence, self-contained summary of what BeDee is and who it serves. Used in /llms.txt.' },
    },
    {
      name: 'stats',
      type: 'array',
      admin: { description: 'Citable brand stats, e.g. "Affiliated doctors" = "500+"' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true },
        { name: 'asOf', type: 'date', required: true },
      ],
    },
  ],
}
