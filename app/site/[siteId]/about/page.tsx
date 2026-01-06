import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSitePublicData } from "@/lib/site-resolver"
import { generateCanonicalUrl } from "@/lib/utils/seo"
import { sanitizeSimpleContent } from "@/lib/utils/sanitize-html"
import { StructuredData } from "@/components/seo/structured-data"
import { generateBreadcrumbSchema } from "@/lib/utils/structured-data"

type Props = {
  params: Promise<{ siteId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      title: "About - Not Found",
    }
  }

  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId), "/about")

  return {
    title: `About - ${site.name}`,
    description: `Learn more about ${site.name}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `About ${site.name}`,
      description: site.description || `Learn more about ${site.name}`,
      type: "website",
      locale: site.language || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    notFound()
  }

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const breadcrumbSchema = generateBreadcrumbSchema(siteUrl, site.name, [
    { name: "Home", url: siteUrl },
    { name: "About", url: `${siteUrl}/about` },
  ])

  return (
    <>
      <StructuredData data={breadcrumbSchema} />

      <div className="container mx-auto px-4 py-12">
        <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
          <h1 className="typography-h1 mb-8 text-balance">About {site.name}</h1>

          {site.about_page_content ? (
            <div className="typography-body space-y-6" dangerouslySetInnerHTML={{ __html: sanitizeSimpleContent(site.about_page_content) }} />
          ) : (
            <div className="space-y-6">
              <p className="typography-body text-pretty">
                Welcome to {site.name}, your trusted source for news and information
                {site.country ? ` in ${site.country}` : ""}.
              </p>

              {site.description && <p className="typography-body text-pretty">{site.description}</p>}

              <div className="mt-8 rounded-lg border bg-muted/30 p-6">
                <h2 className="typography-h3 mb-4">Contact Us</h2>
                <div className="space-y-2">
                  {site.contact_email && (
                    <p className="typography-body">
                      Email:{" "}
                      <a href={`mailto:${site.contact_email}`} className="text-primary hover:underline">
                        {site.contact_email}
                      </a>
                    </p>
                  )}
                  {site.twitter_handle && (
                    <p className="typography-body">
                      Twitter:{" "}
                      <a
                        href={site.twitter_url || `https://twitter.com/${site.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{site.twitter_handle}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  )
}
