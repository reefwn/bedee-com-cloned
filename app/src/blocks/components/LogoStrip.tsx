import Image from 'next/image'

type Partner = { name: string; logo: { url?: string | null }; url?: string | null }

// Section 4 of plans/04-final-prompt.md §3 — background #F4F8FF, H2 color #455FA5.
export function LogoStrip({ heading, partners }: { heading?: string | null; partners: Partner[] }) {
  if (!partners?.length) return null

  return (
    <section className="bg-panel-1 py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && (
          <h2 className="whitespace-pre-line text-2xl font-semibold leading-snug text-tertiary md:text-[28px]">
            {heading}
          </h2>
        )}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
          {partners.map((p, i) => {
            const img = p.logo?.url ? (
              <Image
                src={p.logo.url}
                alt={p.name}
                width={120}
                height={48}
                className="h-full w-auto max-w-[140px] object-contain"
              />
            ) : (
              <span className="text-sm text-muted">{p.name}</span>
            )
            return p.url ? (
              <a key={i} href={p.url} className="flex h-14 items-center justify-center">
                {img}
              </a>
            ) : (
              <div key={i} className="flex h-14 items-center justify-center">
                {img}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
