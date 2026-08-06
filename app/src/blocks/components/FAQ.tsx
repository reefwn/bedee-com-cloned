type FAQItem = {
  question: string
  answer: string
}

type FAQProps = {
  heading?: string | null
  items: FAQItem[]
}

export function FAQ({ heading, items }: FAQProps) {
  if (!items?.length) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      {heading ? <h2 className="mb-6 text-2xl font-semibold text-[#081F7C]">{heading}</h2> : null}
      <dl className="space-y-6">
        {items.map((item, i) => (
          <div key={i}>
            <dt className="text-lg font-semibold text-[#222]">{item.question}</dt>
            <dd className="mt-2 leading-7 text-[#444]">{item.answer}</dd>
          </div>
        ))}
      </dl>
      {/* escape `<` so an editor-authored answer containing "</script>" can't break out of this tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </section>
  )
}
