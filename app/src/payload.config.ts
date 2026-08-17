import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { NewsAndActivities } from './collections/NewsAndActivities'
import { Doctors } from './collections/Doctors'
import { Partners } from './collections/Partners'
import { Services } from './collections/Services'
import { Promotions } from './collections/Promotions'
import { Products } from './collections/Products'
import { Testimonials } from './collections/Testimonials'
import { Pages } from './collections/Pages'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { CorporateInquiries } from './collections/CorporateInquiries'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - BeDee Admin',
      // Same real BeDee capsule mark used site-wide (src/app/icon.png,
      // Next's file-based favicon convention) — no second asset to manage.
      icons: [{ url: '/icon.png' }],
    },
    // Same-origin app (admin + frontend share one Next.js deployment), so
    // relative paths work as the iframe src. Route shape differs per
    // collection (Posts nests under its category slug; Pages' "home" doc
    // maps to "/"), so this switches on collectionConfig.slug rather than
    // a single naive `/${data.slug}` guess.
    livePreview: {
      collections: ['pages', 'services', 'posts', 'news-and-activities'],
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 667 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
      url: async ({ data, collectionConfig, req }) => {
        switch (collectionConfig?.slug) {
          case 'pages':
            return data.slug === 'home' ? '/' : `/${data.slug}`
          case 'services':
            return `/${data.slug}`
          case 'news-and-activities':
            return `/news-activities/${data.slug}`
          case 'posts': {
            const categoryId = typeof data.category === 'object' ? data.category?.id : data.category
            if (!categoryId) return null
            const category = await req.payload.findByID({ collection: 'categories', id: categoryId })
            return category?.slug ? `/article/${category.slug}/${data.slug}` : null
          }
          default:
            return null
        }
      },
    },
  },
  editor: lexicalEditor(),
  localization: {
    locales: ['th'],
    defaultLocale: 'th',
    // Add 'en' here later without a schema migration — every text field is
    // already `localized: true`. See plans/payload-content-model.md.
  },
  collections: [
    Users,
    Media,
    Categories,
    Posts,
    NewsAndActivities,
    Doctors,
    Partners,
    Services,
    Promotions,
    Products,
    Testimonials,
    Pages,
    ContactSubmissions,
    CorporateInquiries,
  ],
  globals: [Header, Footer, SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false,
    // `push` does not reliably work on Vercel's read-only serverless filesystem
    // (drizzle-kit's introspection/write step fails silently) — schema is
    // applied via real migration files instead. See app/ENV_SETUP.md for the
    // one-time `payload migrate` command to run against the live database.
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
