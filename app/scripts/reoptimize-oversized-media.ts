import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'

const dryRun = process.argv.includes('--dry-run')
const SIZE_THRESHOLD_BYTES = 400_000 // ~400KB — these display at 300-600px wide
const MAX_WIDTH = 1200 // covers the article detail page's ~1024px display at a comfortable margin
const WEBP_QUALITY = 82

// Source is our OWN currently-stored file (via the deployed site's own media
// route), never the original bedee.com — keeps this independent of that
// domain, consistent with every other migration script in this repo.
const SITE_ORIGIN = 'https://bedee-payload.vercel.app'

async function fetchToFile(url: string, destPath: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  writeFileSync(destPath, new Uint8Array(buffer))
  return buffer.length
}

function convertToWebp(srcPath: string, destPath: string) {
  execFileSync('magick', [
    srcPath,
    '-resize',
    `${MAX_WIDTH}x${MAX_WIDTH}>`, // only shrinks, never upscales (the `>` flag)
    '-strip', // drop EXIF/color-profile bloat
    '-quality',
    String(WEBP_QUALITY),
    destPath,
  ])
}

const payload = dryRun ? undefined : await getPayload({ config })

function cms(): Payload {
  if (!payload) throw new Error('Payload is unavailable during a dry run')
  return payload
}

async function main() {
  const dbPayload = dryRun ? await getPayload({ config }) : cms()

  const oversized = await dbPayload.find({
    collection: 'media',
    where: { filesize: { greater_than: SIZE_THRESHOLD_BYTES } },
    limit: 1000,
    sort: '-filesize',
    overrideAccess: true,
  })

  console.log(`${oversized.docs.length} media docs over ${SIZE_THRESHOLD_BYTES} bytes`)

  const tmp = mkdtempSync(path.join(tmpdir(), 'reoptimize-'))
  let totalBefore = 0
  let totalAfter = 0
  let converted = 0
  let skipped = 0
  const failures: Array<{ id: number; filename: string; error: string }> = []

  for (const doc of oversized.docs) {
    const filename = doc.filename as string
    const beforeBytes = doc.filesize as number
    try {
      const srcPath = path.join(tmp, filename)
      const fetchedBytes = await fetchToFile(`${SITE_ORIGIN}/api/media/file/${filename}`, srcPath)

      const destFilename = filename.replace(/\.[a-zA-Z0-9]+$/, '.webp')
      const destPath = path.join(tmp, destFilename)
      convertToWebp(srcPath, destPath)
      const afterBuffer = readFileSync(destPath)

      if (afterBuffer.length >= fetchedBytes) {
        console.log(`[skip] ${filename}: webp (${afterBuffer.length}B) not smaller than source (${fetchedBytes}B)`)
        skipped++
        continue
      }

      totalBefore += fetchedBytes
      totalAfter += afterBuffer.length
      converted++

      console.log(
        `${dryRun ? '[dry-run] ' : ''}${filename} -> ${destFilename}: ${fetchedBytes}B -> ${afterBuffer.length}B (${Math.round((1 - afterBuffer.length / fetchedBytes) * 100)}% smaller)`,
      )

      if (!dryRun) {
        await cms().update({
          collection: 'media',
          id: doc.id,
          data: {}, // alt/sourceUrl untouched — only the underlying file changes
          file: {
            data: afterBuffer,
            mimetype: 'image/webp',
            name: destFilename,
            size: afterBuffer.length,
          },
          overrideAccess: true,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push({ id: doc.id, filename, error: message })
      console.error(`[error] ${filename}: ${message}`)
    } finally {
      // filesize can vary; before-bytes fallback for logging even on failure
      void beforeBytes
    }
  }

  rmSync(tmp, { recursive: true, force: true })

  console.log({
    converted,
    skipped,
    failed: failures.length,
    totalBeforeMB: (totalBefore / 1_000_000).toFixed(1),
    totalAfterMB: (totalAfter / 1_000_000).toFixed(1),
    savedMB: ((totalBefore - totalAfter) / 1_000_000).toFixed(1),
    dryRun,
  })
  if (failures.length) console.log('Failures:', failures)

  if (payload) {
    await Promise.race([payload.destroy(), new Promise<void>((resolve) => setTimeout(resolve, 2_000))])
  }
  process.exit(failures.length > 0 ? 1 : 0)
}

main()
