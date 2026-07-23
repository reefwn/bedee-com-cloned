# BeDee → Payload CMS: Content Model, Migration Plan, Deployment

Companion to `plans/03-replication-prompt.md` (visual/component fidelity).
This document covers the other half of the task brief: Payload collections,
WordPress→Payload migration, and Vercel+Supabase deployment.

Source IA reference: `plans/01-site-dna.md` § "SITE MAP / INFORMATION
ARCHITECTURE".

---

## 1. Collections

All fields below are real `@payloadcms/db-postgres`-compatible Payload 3.x
config, not pseudocode. Localization: BeDee is Thai-only today, but every
text field uses Payload's `localized: true` so an English locale can be
added later without a schema migration.

### `media` (uploads)

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: undefined, // remote storage only — see Deployment §5
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768, height: 432 }, // matches source's 16:9 article cards
      { name: 'hero', width: 1920 },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true },
    { name: 'caption', type: 'text', localized: true },
    // preserves the original WP attachment ID for migration traceability/rollback
    { name: 'wpAttachmentId', type: 'number', admin: { position: 'sidebar' } },
  ],
}
```

### `categories` (article taxonomy)

Source has 8 confirmed categories under `/articles/{category}/{slug}`:
mental-health, cancer, wellness, gen-med, skin-aesthetic, pharmacy,
women-health, sexual-health.

```ts
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    // seeded 1:1 from the 8 categories found in Phase 1 — see Migration §3
  ],
}
```

### `posts` (บทความสุขภาพ — health articles)

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    // preserves the source URL shape /articles/{category}/{slug}
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', editor: lexicalEditor(), localized: true },
    // "พญ.อธิชา วัฒนาอุดมชัย" — doctor byline, confirmed present on every article
    { name: 'author', type: 'relationship', relationTo: 'doctors' },
    { name: 'viewCount', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true, maxRows: 4 },
    { name: 'seo', type: 'group', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
    ]},
  ],
}
```

### `newsAndActivities` (ข่าวสารและกิจกรรม)

Confirmed as a DISTINCT post type from health articles (separate nav item,
separate URL `/news-and-activities`) — company/PR news, not medical content.
Do not merge into `posts`; keep the source's real taxonomic separation.

```ts
export const NewsAndActivities: CollectionConfig = {
  slug: 'news-and-activities',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'publishedAt', type: 'date' },
  ],
}
```

### `doctors` (แพทย์ในเครือ / เภสัชกรในเครือ — Section 5 of the homepage)

```ts
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true }, // e.g. "พญ.อธิชา วัฒนาอุดมชัย"
    { name: 'photo', type: 'upload', relationTo: 'media', required: true },
    // drives the Section-5 tab filter (Site DNA 1.6 state machine)
    { name: 'role', type: 'select', required: true, options: [
      { label: 'Doctor', value: 'doctor' },
      { label: 'Pharmacist', value: 'pharmacist' },
    ]},
    { name: 'specialty', type: 'text', localized: true },
    { name: 'hospital', type: 'relationship', relationTo: 'partners' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

### `partners` (BDMS network hospital logo strip — Section 4)

```ts
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true }, // BDMS, Bangkok Hospital, Samitivej, BNH, Phyathai, Paolo, Royal Bangkok, BDMS Wellness Clinic
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

### `services` (teleconsultation / telepharmacy / health-mall — top-level service pages)

```ts
export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true }, // teleconsultation, telepharmacy, health-mall
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    // matches the observed section pattern on /teleconsultation:
    // What-is-BeDee / Why-choose-us / How-it-steps / Benefits / BDMS-proof /
    // Staff-doctors / Which-symptoms-fit / related-promotions / related-articles
    { name: 'intro', type: 'richText', localized: true },
    { name: 'whyChooseUs', type: 'array', fields: [
      { name: 'heading', type: 'text', localized: true },
      { name: 'body', type: 'textarea', localized: true },
      { name: 'icon', type: 'upload', relationTo: 'media' },
    ]},
    { name: 'steps', type: 'array', fields: [
      { name: 'stepNumber', type: 'number' },
      { name: 'label', type: 'text', localized: true },
    ]},
    { name: 'benefits', type: 'array', fields: [
      { name: 'label', type: 'text', localized: true },
    ]},
    { name: 'suitableSymptoms', type: 'array', fields: [
      { name: 'label', type: 'text', localized: true },
    ]},
    { name: 'featuredDoctors', type: 'relationship', relationTo: 'doctors', hasMany: true },
    { name: 'relatedPromotions', type: 'relationship', relationTo: 'promotions', hasMany: true },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
  ],
}
```

### `promotions` (โปรโมชันล่าสุด)

```ts
export const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'banner', type: 'upload', relationTo: 'media', required: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    { name: 'ctaUrl', type: 'text' },
  ],
}
```

### `products` (สินค้าสุขภาพ — health-mall cross-sell)

**Decision needed from you:** Site DNA 1.8 confirms `shop.bedee.com` (the
actual health-PACKAGE checkout) is a separate storefront outside this
WordPress install — likely its own Shopify-shaped system. Two honest options,
do not silently pick one:
- **(a) Link-out only:** `products` in Payload is just marketing copy/imagery
  for the health-mall promo section, with a `ctaUrl` pointing to
  `shop.bedee.com` — no real inventory/checkout in Payload. Simpler, matches
  what's actually live today.
- **(b) Full commerce collection:** build real `price`, `sku`, `stock` fields
  and either proxy the existing shop or run a genuinely new storefront. Only
  worth it if you're also decommissioning the `shop.bedee.com` system —
  otherwise you'd be running two competing product catalogs.

```ts
export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'price', type: 'number' }, // display-only under option (a); real under (b)
    { name: 'externalUrl', type: 'text' }, // shop.bedee.com deep link
  ],
}
```

### `testimonials` (added per your task brief — NOT found on the source site)

Flagged honestly in `plans/02-brand-interview.md`: bedee.com carries trust via
hospital-network logos and named-doctor cards, not customer quotes. Adding
this collection because your brief explicitly asked for it, but it has no
1:1 source page — it needs a NEW placement decision (recommend: service
pages, below "Benefits").

```ts
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'authorName' },
  fields: [
    { name: 'authorName', type: 'text', required: true, localized: true },
    { name: 'authorPhoto', type: 'upload', relationTo: 'media' },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'relatedService', type: 'relationship', relationTo: 'services' },
  ],
}
```

### `pages` (generic — corporate/contact-us/one-offs)

```ts
import { BlocksField } from './blocks' // Hero, IconGrid, LogoStrip, ArticleGrid, RichText — one block per Site DNA section type

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true }, // corporate, contact-us, home
    { name: 'layout', type: 'blocks', blocks: BlocksField, localized: true },
    { name: 'seo', type: 'group', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
    ]},
  ],
}
```

`layout` blocks map 1:1 to the homepage sections in `plans/03-replication-prompt.md`
§3: `HeroCarouselBlock`, `IconGridBlock` (reused for Sections 2/3),
`LogoStripBlock` (Section 4), `ExpertTabsBlock` (Section 5), `PromoBannerBlock`
(Section 6), `ArticleGridBlock` (Section 7). This lets marketing rebuild/reorder
the homepage without a code deploy — which the current static Elementor build
cannot do without editing the page in Elementor directly.

### Globals: `header`, `footer`, `siteSettings`

```ts
export const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'navItems', type: 'array', fields: [
      { name: 'label', type: 'text', localized: true },
      { name: 'url', type: 'text' },
      { name: 'children', type: 'array', fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ]},
    ]},
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  fields: [
    { name: 'tagline', type: 'textarea', localized: true },
    { name: 'linkGroups', type: 'array', fields: [
      { name: 'heading', type: 'text', localized: true }, // บริการของเรา / บทความ / เกี่ยวกับเรา / กฎหมาย
      { name: 'links', type: 'array', fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ]},
    ]},
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'platform', type: 'select', options: ['facebook', 'line', 'instagram'] },
      { name: 'url', type: 'text' },
    ]},
  ],
}
```

---

## 2. Access Control & Auth

Not specified in your brief — defaulting to a reasonable posture, override if
your org has different requirements:
- All content collections: `read: () => true` (public site), `create`/
  `update`/`delete`: `() => user?.role === 'editor' || user?.role === 'admin'`
- `users` collection (Payload's built-in auth) gets a `role` select field
  (`editor` | `admin`) for this gate.
- No public-facing user accounts exist on the source site (no login/account
  area was found in Phase 1) — do not build one unless separately requested.

---

## 3. WordPress → Payload Migration Plan

**Precondition:** actually running this migration requires WordPress admin/
DB credentials for bedee.com, which this session does not have and should
not attempt to guess or brute-force. Everything below is the runnable plan —
you (or whoever holds WP access) execute the extraction step.

### Step 1 — Extract from WordPress

Use the WP REST API (`/wp-json/wp/v2/...`) rather than a raw DB dump — it's
already normalized and matches what Phase 1 observed:
```
GET /wp-json/wp/v2/posts?per_page=100&page=N        → articles (paginate all pages)
GET /wp-json/wp/v2/categories                         → the 8 article categories
GET /wp-json/wp/v2/media?per_page=100&page=N          → media library (for wpAttachmentId mapping)
GET /wp-json/wp/v2/pages                              → corporate, contact-us, etc.
```
`news-and-activities` and custom post types (`promotions`, `services` if
registered as CPTs rather than Elementor pages) may need a custom post-type
REST route — check `wp-json/wp/v2/types` on the live site to confirm exact
route names before scripting the pull.

### Step 2 — Field mapping table

| WordPress field | Payload field | Transform |
|---|---|---|
| `post.title.rendered` | `posts.title` | strip HTML entities |
| `post.slug` | `posts.slug` | direct |
| `post.content.rendered` | `posts.content` | HTML → Lexical via `@payloadcms/richtext-lexical`'s HTML converter, NOT a raw string dump |
| `post.categories[0]` | `posts.category` | map WP category ID → Payload `categories` doc ID (seed categories FIRST, keep an ID lookup table) |
| `post._embedded['wp:featuredmedia']` | `posts.featuredImage` | download the file, re-upload to Payload's `media` collection, store WP attachment ID for traceability |
| author meta (byline text — source doesn't use core WP author API for the doctor byline, it's an ACF/Elementor field) | `posts.author` | requires inspecting the actual ACF/JetEngine meta field name in the WP admin — Phase 1 could only observe the RENDERED byline text, not the underlying field name; get this from WP admin or a DB export before scripting |
| view count (JetEngine/plugin-tracked) | `posts.viewCount` | source-specific — identify the tracking plugin's meta key before scripting |

### Step 3 — Migration script shape

```ts
// scripts/migrate-wp-to-payload.ts (run once, from a machine with WP + Payload network access)
import payload from 'payload'

async function migrateCategories(wpCategories) {
  const idMap = new Map<number, string>()
  for (const cat of wpCategories) {
    const doc = await payload.create({ collection: 'categories', data: { name: cat.name, slug: cat.slug } })
    idMap.set(cat.id, doc.id)
  }
  return idMap
}

async function migrateMedia(wpMediaItem) {
  const res = await fetch(wpMediaItem.source_url)
  const buffer = Buffer.from(await res.arrayBuffer())
  return payload.create({
    collection: 'media',
    data: { alt: wpMediaItem.alt_text || '', wpAttachmentId: wpMediaItem.id },
    file: { data: buffer, mimetype: wpMediaItem.mime_type, name: wpMediaItem.slug, size: buffer.length },
  })
}

async function migratePosts(wpPosts, categoryIdMap) {
  for (const post of wpPosts) {
    const featured = post._embedded?.['wp:featuredmedia']?.[0]
    const media = featured ? await migrateMedia(featured) : null
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title.rendered,
        slug: post.slug,
        category: categoryIdMap.get(post.categories[0]),
        featuredImage: media?.id,
        content: htmlToLexical(post.content.rendered), // real converter, not string dump
        publishedAt: post.date,
      },
    })
  }
}
```

Run categories → media → posts, in that dependency order, exactly once per
environment. Keep the script idempotent (check for an existing doc by slug
before creating) so a partial-failure re-run doesn't duplicate content.

### Step 4 — URL/slug preservation & redirects

Source URL shape `/articles/{category}/{slug}` must be preserved (or 301-
redirected) to avoid breaking existing SEO/backlinks. In the Next.js app,
either:
- Route `app/articles/[category]/[slug]/page.tsx` to match exactly, or
- If the new IA flattens to `/posts/[slug]`, add redirects in
  `next.config.js` for every old `/articles/{category}/{slug}` → new path.

### Step 5 — Validation

After migration: compare post COUNT between WP (`X-WP-Total` response
header) and Payload (`payload.count({ collection: 'posts' })`) before
decommissioning the WordPress install. Spot-check 5–10 articles' rich text
rendering for lost formatting (WP shortcodes/Elementor widgets embedded
inline in `post.content.rendered` will NOT convert cleanly — these need
manual review, they don't have a Lexical equivalent).

---

## 4. Deployment: Vercel + Supabase

This session has no Supabase or Vercel credentials connected — the MCP tools
for both are available but unauthenticated. The config below is what to run
once you connect them; I have not provisioned anything yet.

### Supabase (database)

1. Create a Supabase project (Postgres).
2. Connection string → Vercel env var `DATABASE_URI` (use the **pooled**
   connection string, `pgbouncer=true`, for serverless — Vercel functions
   open many short-lived connections; the direct connection string will
   exhaust Postgres's connection limit).
3. Payload config:
```ts
// payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  // ...collections, globals
})
```

### File storage — do NOT use local disk

Vercel's filesystem is ephemeral/read-only at runtime — Payload's default
local `upload.staticDir` will not persist across deploys or even across
requests reliably. Use one of:
- `@payloadcms/storage-vercel-blob` (simplest if already on Vercel)
- `@payloadcms/storage-s3` pointed at Supabase Storage's S3-compatible endpoint

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

### Vercel (app hosting)

1. Deploy the Next.js app (with Payload mounted via its Next.js integration,
   `@payloadcms/next`) as a normal Vercel project.
2. Required env vars: `DATABASE_URI`, `PAYLOAD_SECRET` (generate a random
   32+ char string, never reuse across environments), `BLOB_READ_WRITE_TOKEN`
   (if using Vercel Blob).
3. Payload's admin UI runs at `/admin` inside the same Next.js app — no
   separate backend deployment needed.
4. Set Vercel's function region close to Supabase's project region to avoid
   cross-region DB latency on every request.

### What has actually been done in this session

- **Supabase project created:** `bedee-payload`, ref `fzxcitvbkfemjdhzjcib`,
  region `ap-southeast-1` (Singapore), org `POC`, $0/mo tier. Postgres is
  live and ready for Payload to connect to.
- **App scaffolded for real:** a working Payload 3.86 + Next.js 15.4.11 app
  lives in `app/` in this repo — every collection/global above as real
  TypeScript config, plus a functional (not just spec'd) frontend for the
  homepage block system and article listing/detail. `npm run build` passes
  cleanly (verified locally).
- **Deployed to Vercel:** project `bedee-payload` on team
  `reef3llenhotmailcoms-projects`. See chat for the live URL once the build
  finishes.

### What still needs you

- **`DATABASE_URI`:** the Supabase DB password is never exposed via MCP (by
  design — that's a security boundary, not an oversight). Get it from the
  Supabase dashboard (Project Settings → Database → reset password if
  needed) and set it as a Vercel env var yourself — see `app/ENV_SETUP.md`.
- **`BLOB_READ_WRITE_TOKEN`:** create a Blob store in the Vercel dashboard
  (Storage tab) and copy its token in the same way.
- **`PAYLOAD_SECRET`:** generate with `openssl rand -hex 32` and set it too.
- Until those three are set in Vercel, the deployed app will build fine but
  error at runtime on any page that touches the database (i.e. everything
  except a raw 404).
- No actual WordPress data pulled — no WP credentials available here, and
  pulling real patient-adjacent content without an explicit go-ahead on
  which environment (staging vs. production `bedee.com`) is not something to
  do silently.
