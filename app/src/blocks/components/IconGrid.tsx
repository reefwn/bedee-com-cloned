import Image from 'next/image'

type Item = {
  icon: { url?: string | null; alt?: string | null }
  label: string
  url?: string | null
}

// Sections 2 & 3 of plans/04-final-prompt.md §3 — same card component, 4 or 3 columns.
export function IconGrid({
  heading,
  items,
  variant = 'tinted',
}: {
  heading?: string | null
  items: Item[]
  variant?: 'tinted' | 'plain' | null
}) {
  if (!items?.length) return null
  const cols = items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  const background =
    variant === 'plain' ? 'bg-white' : 'bg-gradient-to-tr from-[#F9F9F9] to-[#E5EDFF]'

  return (
    <section className={`${background} py-12`}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        {heading && (
          <h2 className="mb-8 text-[28px] font-semibold text-primary">{heading}</h2>
        )}
        <div className={`grid grid-cols-2 gap-8 ${cols}`}>
        {items.map((item, i) => {
          const content = (
            <>
              {item.icon?.url && (
                <Image
                  src={item.icon.url}
                  alt={item.icon.alt || ''}
                  width={64}
                  height={64}
                  className="mx-auto h-24 w-24 object-contain"
                />
              )}
              <p className="mt-3 text-base font-medium text-ink">{item.label}</p>
            </>
          )
          return item.url ? (
            <a key={i} href={item.url}>
              {content}
            </a>
          ) : (
            <div key={i}>{content}</div>
          )
        })}
        </div>
      </div>
    </section>
  )
}
