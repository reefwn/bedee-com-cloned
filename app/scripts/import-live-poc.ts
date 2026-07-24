import { createHash } from 'node:crypto'
import path from 'node:path'

import { Window } from 'happy-dom'
import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'

type ParsedDocument = InstanceType<typeof Window>['document']

const POST_URLS = [
  'https://www.bedee.com/articles/skin-aesthetic/sebderm',
  'https://www.bedee.com/articles/skin-aesthetic/inflammatory-acne',
  'https://www.bedee.com/articles/mental-health/adolescence',
  'https://www.bedee.com/articles/mental-health/stress-level',
  'https://www.bedee.com/articles/mental-health/run-out-of-passion',
  'https://www.bedee.com/articles/mental-health/game-addiction',
  'https://www.bedee.com/articles/wellness/work-life-balance',
  'https://www.bedee.com/articles/mental-health/academic-burnout',
  'https://www.bedee.com/articles/gen-med/snoring',
  'https://www.bedee.com/articles/gen-med/obstructive-sleep-apnea',
]

const PAGE_URLS = [
  'https://www.bedee.com/telepharmacy',
  'https://www.bedee.com/promotions',
  'https://www.bedee.com/teleconsultation',
  'https://www.bedee.com/health-mall',
  'https://www.bedee.com/health-plaza',
  'https://www.bedee.com/corporate',
  'https://www.bedee.com/contact-us',
  'https://www.bedee.com/article',
  'https://www.bedee.com/news-activities',
  'https://www.bedee.com/bedees-story',
]

const CATEGORY_NAMES: Record<string, string> = {
  'gen-med': 'โรคทั่วไป',
  'mental-health': 'สุขภาพใจ',
  'skin-aesthetic': 'ผิวและความงาม',
  wellness: 'Wellness',
}

const dryRun = process.argv.includes('--dry-run')

type SerializedTextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: 1
}

type ContentChunk = {
  tag: string
  text: string
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

function textNode(text: string): SerializedTextNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function chunksToLexical(chunks: ContentChunk[]) {
  return {
    root: {
      children: chunks.map(({ tag, text }) => {
        const isHeading = /^h[2-4]$/.test(tag)
        const common = {
          children: [textNode(tag === 'li' ? `• ${text}` : text)],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1 as const,
        }

        if (isHeading) {
          return {
            ...common,
            tag: tag as 'h2' | 'h3' | 'h4',
            type: 'heading' as const,
          }
        }

        return {
          ...common,
          textFormat: 0,
          textStyle: '',
          type: 'paragraph' as const,
        }
      }),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root' as const,
      version: 1 as const,
    },
  }
}

function createDocument(html: string, url: string) {
  const window = new Window({ url })
  window.document.write(html)
  return window.document
}

function getMeta(document: ParsedDocument, selector: string): string {
  return normalizeText(document.querySelector(selector)?.getAttribute('content'))
}

function getTitle(document: ParsedDocument): string {
  const heading = normalizeText(document.querySelector('main h1, h1')?.textContent)
  const socialTitle = getMeta(document, 'meta[property="og:title"]')
  return (heading || socialTitle || normalizeText(document.title)).replace(/\s*-\s*BeDee\s*$/, '')
}

function extractChunks(document: ParsedDocument, kind: 'page' | 'post'): ContentChunk[] {
  const root =
    kind === 'post'
      ? document.querySelector('.single-content .content .elementor') ?? document.querySelector('main')
      : document.querySelector('#page > .elementor, .site-content > .elementor, main, article')

  if (!root) return []

  root
    .querySelectorAll(
      'script, style, noscript, nav, form, footer, [class*="related"], [class*="cookie"], [class*="breadcrumb"], [class*="share"], [class*="social"]',
    )
    .forEach((node) => node.remove())

  const chunks: ContentChunk[] = []
  let previous = ''

  root.querySelectorAll('h2, h3, h4, p, li, blockquote').forEach((node) => {
    const text = normalizeText(node.textContent)
    if (text.length < 2 || text === previous) return
    previous = text
    chunks.push({ tag: node.tagName.toLowerCase(), text })
  })

  return chunks.slice(0, 160)
}

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'BeDee-Payload-POC/1.0',
    },
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  return response.text()
}

function sourceSlug(url: string): string {
  const parts = new URL(url).pathname.split('/').filter(Boolean)
  return decodeURIComponent(parts.at(-1) ?? 'home')
}

function categorySlug(url: string): string {
  const parts = new URL(url).pathname.split('/').filter(Boolean)
  return parts[1] ?? 'uncategorized'
}

async function downloadImage(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'BeDee-Payload-POC/1.0' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)

  const data = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
  const originalName = path.basename(decodeURIComponent(new URL(url).pathname)) || 'image.jpg'
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 10)
  const name = `${hash}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '-')}`

  return { data, mimetype: contentType, name, size: data.length }
}

const payload = dryRun ? undefined : await getPayload({ config })

function cms(): Payload {
  if (!payload) throw new Error('Payload is unavailable during a dry run')
  return payload
}

async function upsertCategory(slug: string) {
  const existing = await cms().find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]

  return cms().create({
    collection: 'categories',
    data: { name: CATEGORY_NAMES[slug] ?? slug, slug },
    locale: 'th',
    overrideAccess: true,
  })
}

async function upsertMedia(sourceUrl: string, alt: string) {
  const existing = await cms().find({
    collection: 'media',
    where: { sourceUrl: { equals: sourceUrl } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]

  const file = await downloadImage(sourceUrl)
  return cms().create({
    collection: 'media',
    data: { alt, sourceUrl },
    file,
    locale: 'th',
    overrideAccess: true,
  })
}

async function importPost(url: string) {
  const html = await fetchHTML(url)
  const document = createDocument(html, url)
  const title = getTitle(document)
  const slug = sourceSlug(url)
  const category = categorySlug(url)
  const chunks = extractChunks(document, 'post')
  const imageUrl = getMeta(document, 'meta[property="og:image"]')
  const description = getMeta(document, 'meta[name="description"]')
  const publishedAt =
    getMeta(document, 'meta[property="article:published_time"]') ||
    document.querySelector('time[datetime]')?.getAttribute('datetime') ||
    undefined

  if (!title || chunks.length === 0 || !imageUrl) {
    throw new Error(`Incomplete article extraction for ${url}`)
  }

  if (dryRun) return { kind: 'post', slug, title, chunks: chunks.length, image: true }

  const [categoryDoc, mediaDoc] = await Promise.all([
    upsertCategory(category),
    upsertMedia(imageUrl, title),
  ])
  const existing = await cms().find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  const data = {
    title,
    slug,
    category: categoryDoc.id,
    featuredImage: mediaDoc.id,
    excerpt: description,
    content: chunksToLexical(chunks),
    publishedAt,
    sourceUrl: url,
    seo: { metaTitle: title, metaDescription: description },
    _status: 'published' as const,
  }

  if (existing.docs[0]) {
    await cms().update({
      collection: 'posts',
      id: existing.docs[0].id,
      data,
      locale: 'th',
      overrideAccess: true,
    })
    return { kind: 'post', slug, action: 'updated' }
  }

  await cms().create({
    collection: 'posts',
    data,
    locale: 'th',
    overrideAccess: true,
  })
  return { kind: 'post', slug, action: 'created' }
}

async function importPage(url: string) {
  const html = await fetchHTML(url)
  const document = createDocument(html, url)
  const title = getTitle(document)
  const slug = sourceSlug(url)
  const chunks = extractChunks(document, 'page')
  const description = getMeta(document, 'meta[name="description"]')

  if (!title || chunks.length === 0) throw new Error(`Incomplete page extraction for ${url}`)
  if (dryRun) return { kind: 'page', slug, title, chunks: chunks.length }

  const existing = await cms().find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'th',
    overrideAccess: true,
  })
  const data = {
    title,
    slug,
    sourceUrl: url,
    layout: [
      {
        blockType: 'richTextContent' as const,
        heading: title,
        content: chunksToLexical(chunks),
      },
    ],
    seo: { metaTitle: title, metaDescription: description },
    _status: 'published' as const,
  }

  if (existing.docs[0]) {
    await cms().update({
      collection: 'pages',
      id: existing.docs[0].id,
      data,
      locale: 'th',
      overrideAccess: true,
    })
    return { kind: 'page', slug, action: 'updated' }
  }

  await cms().create({
    collection: 'pages',
    data,
    locale: 'th',
    overrideAccess: true,
  })
  return { kind: 'page', slug, action: 'created' }
}

const results: unknown[] = []
const failures: Array<{ url: string; error: string }> = []

for (const url of POST_URLS) {
  try {
    const result = await importPost(url)
    results.push(result)
    console.log(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    failures.push({ url, error: message })
    console.error({ url, error: message })
  }
}

for (const url of PAGE_URLS) {
  try {
    const result = await importPage(url)
    results.push(result)
    console.log(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    failures.push({ url, error: message })
    console.error({ url, error: message })
  }
}

console.log({ imported: results.length, failed: failures.length, dryRun })

if (!dryRun && failures.length === 0) {
  const [postCount, pageCount] = await Promise.all([
    cms().count({
      collection: 'posts',
      where: { sourceUrl: { in: POST_URLS } },
      overrideAccess: true,
    }),
    cms().count({
      collection: 'pages',
      where: { sourceUrl: { in: PAGE_URLS } },
      overrideAccess: true,
    }),
  ])

  console.log({ verifiedPosts: postCount.totalDocs, verifiedPages: pageCount.totalDocs })
  if (postCount.totalDocs !== POST_URLS.length || pageCount.totalDocs !== PAGE_URLS.length) {
    failures.push({
      url: 'database-verification',
      error: `Expected ${POST_URLS.length} posts and ${PAGE_URLS.length} pages`,
    })
  }
}

if (payload) {
  await Promise.race([
    payload.destroy(),
    new Promise<void>((resolve) => {
      setTimeout(resolve, 2_000)
    }),
  ])
}

process.exit(failures.length > 0 ? 1 : 0)
