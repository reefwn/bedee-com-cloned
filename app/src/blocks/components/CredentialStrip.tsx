import Image from 'next/image'

type CredentialItem = {
  image: { url?: string | null; alt?: string | null }
  label: string
}

// From revise-website.pptx slide 5 (BeDeeCredentials.png, asset-homepage,
// full-res) — same slide as the testimonials section, its other half.
// Real official marks (BSI ISO certs, PDPA badge, the Garuda hospital-
// license emblem, the Pharmacy Council seal), so they stay as-is rather
// than getting the circular-crop treatment reserved for human photography.
// AI-SEO: Organization.hasCredential — genuine certifications the badges
// depict, not fabricated ratings or claims.
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
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {items.map((item, i) => (
            <li key={i} className="flex w-32 flex-col items-center gap-3">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
