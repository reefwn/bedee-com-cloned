import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ExpertTabs } from '@/blocks/components/ExpertTabs'
import { FAQ } from '@/blocks/components/FAQ'
import type { Service } from '@/payload-types'

// Section pattern from plans/01-site-dna.md §1.8 (teleconsultation): intro,
// why-choose-us, steps, benefits, BDMS-affiliated staff, suitable symptoms,
// pricing, FAQ, related promotions/articles.
export function ServiceDetail({ service }: { service: Service }) {
  const hero = typeof service.heroImage === 'object' ? service.heroImage : null
  const doctors = (service.featuredDoctors ?? [])
    .filter((d): d is Exclude<typeof d, number> => typeof d === 'object')
    .map((d) => ({
      ...d,
      id: String(d.id),
      photo: typeof d.photo === 'object' ? d.photo : { url: null },
    }))
  const promotions = (service.relatedPromotions ?? []).filter(
    (p): p is Exclude<typeof p, number> => typeof p === 'object',
  )
  const posts = (service.relatedPosts ?? []).filter(
    (p): p is Exclude<typeof p, number> => typeof p === 'object',
  )

  return (
    <main>
      <section className="bg-panel-2 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-semibold text-primary">{service.title}</h1>
          {hero?.url && (
            <Image
              src={hero.url}
              alt={hero.alt ?? service.title}
              width={1200}
              height={600}
              className="mt-8 w-full rounded-2xl object-cover"
            />
          )}
          {service.intro && (
            <RichText
              className="mt-8 space-y-4 leading-8 text-ink [&_a]:text-secondary"
              data={service.intro}
            />
          )}
        </div>
      </section>

      {service.whyChooseUs?.length ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-primary">ทำไมต้องเลือกเรา</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.whyChooseUs.map((item, i) => {
              const icon = typeof item.icon === 'object' ? item.icon : null
              return (
                <div key={i}>
                  {icon?.url && (
                    <Image src={icon.url} alt="" width={48} height={48} className="mb-3" />
                  )}
                  {item.heading && <h3 className="font-semibold text-ink">{item.heading}</h3>}
                  {item.body && <p className="mt-1 text-sm text-muted">{item.body}</p>}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {service.steps?.length ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-primary">ขั้นตอนการใช้บริการ</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps
                .slice()
                .sort((a, b) => (a.stepNumber ?? 0) - (b.stepNumber ?? 0))
                .map((step, i) => (
                  <li key={i} className="rounded-2xl bg-panel-2 p-6">
                    <span className="text-3xl font-semibold text-secondary">
                      {step.stepNumber ?? i + 1}
                    </span>
                    <p className="mt-2 text-sm text-ink">{step.label}</p>
                  </li>
                ))}
            </ol>
          </div>
        </section>
      ) : null}

      {service.benefits?.length ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-primary">ประโยชน์</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.benefits.map((b, i) => (
              <li key={i} className="text-ink">
                • {b.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {doctors.length ? <ExpertTabs heading="แพทย์และเภสัชกรในเครือ" doctors={doctors} /> : null}

      {service.suitableSymptoms?.length ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-primary">อาการที่เหมาะกับบริการนี้</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.suitableSymptoms.map((s, i) => (
              <span key={i} className="rounded-pill bg-panel-2 px-4 py-2 text-sm text-ink">
                {s.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {service.pricing?.length ? (
        <section id="pricing" className="bg-panel-2 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-primary">ค่าบริการ</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.pricing.map((tier, i) => (
                <div key={i} className="rounded-2xl bg-white p-6">
                  <h3 className="font-semibold text-ink">{tier.tierLabel}</h3>
                  <p className="mt-2 text-2xl font-semibold text-secondary">
                    {tier.price} {tier.currency ?? 'THB'}
                  </p>
                  {tier.durationMinutes && (
                    <p className="text-sm text-muted">{tier.durationMinutes} นาที</p>
                  )}
                  {tier.notes && <p className="mt-2 text-sm text-muted">{tier.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* AI SEO: same pricing tiers structured at /pricing.md for AI agents */}
      <FAQ heading={service.faqs?.length ? 'คำถามที่พบบ่อย' : undefined} items={service.faqs ?? []} />

      {promotions.length ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-primary">โปรโมชันที่เกี่ยวข้อง</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => {
              const banner = typeof promo.banner === 'object' ? promo.banner : null
              return (
                <a key={promo.id} href={promo.ctaUrl || '#'} className="block rounded-2xl bg-panel-2 p-4">
                  {banner?.url && (
                    <Image
                      src={banner.url}
                      alt={promo.title}
                      width={400}
                      height={240}
                      className="rounded-xl object-cover"
                    />
                  )}
                  <p className="mt-3 font-medium text-ink">{promo.title}</p>
                </a>
              )
            })}
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-primary">บทความที่เกี่ยวข้อง</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const category = typeof post.category === 'object' ? post.category : null
              const href = category ? `/article/${category.slug}/${post.slug}` : '#'
              return (
                <a key={post.id} href={href} className="block rounded-2xl bg-white p-4 shadow-sm">
                  <p className="font-medium text-ink">{post.title}</p>
                  {post.excerpt && <p className="mt-1 text-sm text-muted">{post.excerpt}</p>}
                </a>
              )
            })}
          </div>
        </section>
      ) : null}
    </main>
  )
}
