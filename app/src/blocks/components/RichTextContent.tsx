import { RichText } from '@payloadcms/richtext-lexical/react'

type RichTextContentProps = {
  heading?: string | null
  // Payload's generated rich-text node union is intentionally open to editor features.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

export function RichTextContent({ heading, content }: RichTextContentProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      {heading ? <h1 className="mb-8 text-3xl font-semibold text-[#081F7C]">{heading}</h1> : null}
      <RichText
        className="space-y-5 leading-8 text-[#222] [&_a]:text-[#317DF5] [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#081F7C] [&_h3]:pt-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:pt-1 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#317DF5] [&_li]:ml-6 [&_li]:list-disc"
        data={content}
      />
    </section>
  )
}
