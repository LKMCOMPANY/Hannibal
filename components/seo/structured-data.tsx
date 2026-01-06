/**
 * Structured Data Component
 *
 * Renders JSON-LD structured data for SEO
 */

type Props = {
  data: Record<string, any> | Record<string, any>[]
}

export function StructuredData({ data }: Props) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  )
}
