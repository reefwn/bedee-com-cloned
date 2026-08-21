import Image from 'next/image'

type CredentialItem = {
  image: { url?: string | null; alt?: string | null }
  label: string
  issuedBy?: string | null
  identifier?: string | null
  validFrom?: string | null
  validUntil?: string | null
  certificateUrl?: string | null
}

const safeUrl = (url?: string | null) =>
  url && /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : undefined

// From revise-website.pptx slide 5 (BeDeeCredentials.png, asset-homepage,
// full-res) — same slide as the testimonials section, its other half.
// Real official marks (BSI ISO certs, PDPA badge, the Garuda hospital-
// license emblem, the Pharmacy Council seal), so they stay as-is rather
// than getting the circular-crop treatment reserved for human photography.
// AI-SEO: Organization.hasCredential — genuine certifications the badges
// depict, enriched with the real certificate/issuer/date facts transcribed
// from the source scans (specific verifiable facts are what makes a claim
// citable to AI search, not the badge name alone). No fabricated ratings.
// certificateUrl is deliberately optional — renders "coming soon" instead of
// a dead or fabricated link until a real one exists. Where a certificateUrl
// points off-domain (e.g. the Pharmacy Council item -> pharmacycouncil.org),
// that's intentional: an independently-verifiable primary source is a
// stronger AI-citation signal than a self-hosted copy. A mirror of that PDF
// lives at /certs/pharmacy-council-announcement-70-2568.pdf as a durable
// fallback only, in case that old Joomla-style page ever rots — swap the
// item's certificateUrl to it if pharmacycouncil.org's link breaks.
export function CredentialStrip({
  kicker,
  heading,
  body,
  items,
}: {
  kicker?: string | null
  heading: string
  body?: string | null
  items: CredentialItem[]
}) {
  if (!items?.length) return null

  const credentialJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BeDee',
    hasCredential: items.map((item) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: item.label,
      ...(item.issuedBy ? { recognizedBy: { '@type': 'Organization', name: item.issuedBy } } : {}),
      ...(item.identifier ? { identifier: item.identifier } : {}),
      ...(item.validFrom ? { validFrom: item.validFrom.slice(0, 10) } : {}),
      ...(item.validUntil ? { validUntil: item.validUntil.slice(0, 10) } : {}),
      ...(safeUrl(item.certificateUrl) ? { url: safeUrl(item.certificateUrl) } : {}),
    })),
  }

  return (
    <section className="bg-panel-2 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-5xl px-6 text-center">
        {kicker && <p className="text-sm font-semibold tracking-wide text-primary">{kicker}</p>}
        <h2 className="mt-2 text-[28px] font-semibold text-primary">{heading}</h2>
        {body && <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink">{body}</p>}
        <ul className="mt-10 flex flex-wrap items-start justify-center gap-x-10 gap-y-10">
          {items.map((item, i) => {
            const link = safeUrl(item.certificateUrl)
            return (
              <li key={i} className="flex w-44 flex-col items-center gap-3">
                {item.image?.url && (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.label}
                    width={160}
                    height={100}
                    className="h-16 w-auto object-contain"
                  />
                )}
                <span className="text-sm font-medium text-ink">{item.label}</span>
                {(item.identifier || item.validUntil) && (
                  <p className="text-xs leading-relaxed text-muted">
                    {item.identifier && <>เลขที่ {item.identifier}</>}
                    {item.identifier && item.validUntil && <br />}
                    {item.validUntil && (
                      <>มีผลถึง {new Date(item.validUntil).toLocaleDateString('th-TH')}</>
                    )}
                  </p>
                )}
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-secondary underline-offset-2 hover:underline"
                  >
                    ดูใบรับรอง
                  </a>
                ) : (
                  <span className="text-xs text-muted/70">ใบรับรอง (เร็วๆ นี้)</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
