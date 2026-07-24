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
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
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
  ],
  globals: [Header, Footer],
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
