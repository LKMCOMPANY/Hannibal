import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSitePublicData } from "@/lib/site-resolver"
import { getLocaleFromSiteLanguage } from "@/lib/i18n"
import { sanitizeSimpleContent } from "@/lib/utils/sanitize-html"

type Props = {
  params: Promise<{ siteId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      title: "Privacy Policy - Not Found",
    }
  }

  return {
    title: `Privacy Policy - ${site.name}`,
    description: `Privacy policy for ${site.name}`,
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    notFound()
  }

  const locale = getLocaleFromSiteLanguage(site.language || "en")

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
        <h1 className="typography-h1 mb-8 text-balance">Privacy Policy</h1>

        {site.privacy_page_content ? (
          <div className="typography-body space-y-6" dangerouslySetInnerHTML={{ __html: sanitizeSimpleContent(site.privacy_page_content) }} />
        ) : (
          <div className="space-y-6">
            <p className="typography-small text-muted-foreground">
              Last updated: {new Date().toLocaleDateString(locale)}
            </p>

            <section>
              <h2 className="typography-h2 mb-4">Introduction</h2>
              <p className="typography-body text-pretty">
                {site.name} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, and safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="typography-h2 mb-4">Information We Collect</h2>
              <p className="typography-body text-pretty">
                We may collect information about your device, browsing actions, and patterns. We collect this
                information automatically through cookies and similar technologies.
              </p>
            </section>

            <section>
              <h2 className="typography-h2 mb-4">How We Use Your Information</h2>
              <p className="typography-body text-pretty">
                We use the information we collect to improve our website, understand how visitors use our site, and
                provide relevant content and advertisements.
              </p>
            </section>

            <section>
              <h2 className="typography-h2 mb-4">Contact Us</h2>
              <p className="typography-body text-pretty">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                {site.contact_email ? (
                  <a href={`mailto:${site.contact_email}`} className="text-primary hover:underline">
                    {site.contact_email}
                  </a>
                ) : (
                  "our contact email"
                )}
                .
              </p>
            </section>
          </div>
        )}
      </article>
    </div>
  )
}
