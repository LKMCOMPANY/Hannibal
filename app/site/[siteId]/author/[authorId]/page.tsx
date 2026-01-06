import type { Metadata } from "next"
import { getSitePublicData } from "@/lib/site-resolver"
import { getAuthorById } from "@/lib/data/authors"
import { getPublishedArticlesByAuthor } from "@/lib/data/public-articles"
import AuthorPageClient from "./author-page-client"
import { StructuredData } from "@/components/seo/structured-data"
import { generateCanonicalUrl } from "@/lib/utils/seo"
import { generatePersonSchema, generateBreadcrumbSchema } from "@/lib/utils/structured-data"

type Props = {
  params: Promise<{ siteId: string; authorId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId, authorId } = await params
  const site = await getSitePublicData(Number(siteId))
  const author = await getAuthorById(Number(authorId))

  if (!site || !author) {
    return {
      title: "Author - Not Found",
    }
  }

  const authorName = `${author.first_name} ${author.last_name}`.trim()
  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId), `/author/${authorId}`)

  return {
    title: `${authorName} - ${site.name}`,
    description: author.bio || `Articles by ${authorName} on ${site.name}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${authorName} - ${site.name}`,
      description: author.bio || `Articles by ${authorName} on ${site.name}`,
      type: "profile",
      locale: site.language || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { siteId, authorId } = await params
  const site = await getSitePublicData(Number(siteId))
  const author = await getAuthorById(Number(authorId))
  const articles = await getPublishedArticlesByAuthor(Number(siteId), Number(authorId))

  const siteUrl = site?.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const authorName = author ? `${author.first_name} ${author.last_name}`.trim() : "Unknown Author"

  const personSchema = author ? generatePersonSchema(authorName, author.bio, author.email) : null
  const breadcrumbSchema = generateBreadcrumbSchema(siteUrl, site?.name || "", [
    { name: "Home", url: siteUrl },
    { name: authorName, url: `${siteUrl}/author/${authorId}` },
  ])

  return (
    <>
      {personSchema && <StructuredData data={[personSchema, breadcrumbSchema]} />}

      <AuthorPageClient site={site} author={author} articles={articles} />
    </>
  )
}
