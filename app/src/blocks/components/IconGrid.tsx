import Image from 'next/image'

type Item = {
  icon: { url?: string | null; alt?: string | null }
  label: string
  url?: string | null
}

// Sections 2 & 3 of plans/04-final-prompt.md §3 — same card component, 4 or 3 columns.
export function IconGrid({ items }: { items: Item[] }) {
  if (!items?.length) return null
  const cols = items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="bg-gradient-to-tr from-[#F9F9F9] to-[#E5EDFF] py-16">
      <div className={`mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center ${cols}`}>
        {items.map((item, i) => {
          const content = (
            <>
              {item.icon?.url && (
                <Image
                  src={item.icon.url}
                  alt={item.icon.alt || ''}
                  width={64}
                  height={64}
                  className="mx-auto rounded-full"
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
    </section>
  )
}
