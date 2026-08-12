import Link from 'next/link'
import type { Product } from '@/payload-types'
import { ProductGallery } from './ProductGallery'

const LINE_CONSULT_URL = 'https://line.me/ti/p/~@bedeebybdms'

function BulletSection({ title, items }: { title: string; items?: { text?: string | null }[] | null }) {
  const visible = (items ?? []).filter((i) => i.text)
  if (!visible.length) return null
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink">
        {visible.map((item, i) => (
          <li key={i}>{item.text}</li>
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

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={gallery} title={product.title} />

        <div>
          <h1 className="text-2xl font-semibold text-ink">{product.title}</h1>
          {typeof product.price === 'number' && (
            <p className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">฿{product.price.toLocaleString('th-TH')}</span>
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
              className="rounded-pill bg-primary px-6 py-3 text-center text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              ช้อปเลย!
            </a>
            <a
              href={LINE_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border border-secondary px-6 py-3 text-center text-[15px] font-medium text-secondary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
            >
              ปรึกษาผ่านไลน์
            </a>
          </div>
        </div>
      </div>

      {hasDetails ? (
        <div className="mt-14 border-t border-panel-2 pt-10">
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
