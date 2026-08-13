import Link from 'next/link'
import type { Product } from '@/payload-types'
import { ProductGallery } from './ProductGallery'

const LINE_CONSULT_URL = 'https://line.me/ti/p/~@bedeebybdms'

// Real icons — same shopping-basket + LINE brand-mark paths bedee.com's own
// PDP buttons use (FontAwesome solid), not stand-ins.
function ShopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
      <path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z" />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z" />
    </svg>
  )
}

function BulletSection({ title, items }: { title: string; items?: { text?: string | null }[] | null }) {
  const visible = (items ?? []).filter((i) => i.text)
  if (!visible.length) return null
  return (
    <div className="mt-8">
      {/* Matches RichTextContent's h3 treatment (text-xl/semibold, ink) — the
          page's one h2-equivalent heading is "รายละเอียดสินค้า" above; these
          are its subsections, not peers of it. */}
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-3 ml-6 list-disc text-ink">
        {visible.map((item, i) => (
          <li key={i} className="mb-2 pl-1">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductDetail({ product }: { product: Product }) {
  const mainImage = typeof product.image === 'object' ? product.image : null
  const gallery = [
    { url: mainImage?.url, alt: mainImage?.alt },
    ...(product.gallery ?? [])
      .map((row) => (typeof row.image === 'object' ? row.image : null))
      .filter((img): img is NonNullable<typeof img> => Boolean(img))
      .map((img) => ({ url: img.url, alt: img.alt })),
  ]

  const hasDetails =
    product.highlights?.length || product.keyIngredients?.length || product.usage?.length || product.warnings?.length

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/health-mall" className="hover:text-secondary">
          ช้อปสินค้าสุขภาพ
        </Link>{' '}
        › <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={gallery} title={product.title} />

        <div>
          {/* text-3xl/semibold/primary matches RichTextContent's h1 — every
              other page's title carries this weight; the product name is
              this page's title. */}
          <h1 className="text-3xl font-semibold text-primary">{product.title}</h1>
          {typeof product.price === 'number' && (
            <p className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-primary">฿{product.price.toLocaleString('th-TH')}</span>
              {typeof product.originalPrice === 'number' && (
                <span className="text-lg text-muted line-through">
                  ฿{product.originalPrice.toLocaleString('th-TH')}
                </span>
              )}
            </p>
          )}
          {product.shortDescription && <p className="mt-4 font-medium text-ink">{product.shortDescription}</p>}
          {product.description && <p className="mt-2 text-muted">{product.description}</p>}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              <ShopIcon />
              ช้อปเลย!
            </a>
            {/* LINE's own brand green (#06C755) as an outline/secondary
                treatment — same real-world convention as any "Continue with
                LINE" button; not the site's own accent. */}
            <a
              href={LINE_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-pill border border-[#06C755] bg-white px-6 py-3 text-[15px] font-medium text-[#06C755] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(6,199,85,0.4)]"
            >
              <LineIcon />
              ปรึกษาผ่านไลน์
            </a>
          </div>
        </div>
      </div>

      {hasDetails ? (
        <div className="mt-12 border-t border-panel-2 pt-12">
          <h2 className="text-center text-2xl font-semibold text-primary">รายละเอียดสินค้า</h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <BulletSection title="คุณสมบัติ" items={product.highlights} />
            <BulletSection title="ส่วนประกอบสำคัญ" items={product.keyIngredients} />
            <BulletSection title="ขนาดรับประทาน" items={product.usage} />
            <BulletSection title="คำเตือน" items={product.warnings} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
