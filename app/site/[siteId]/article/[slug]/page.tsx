import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticleBySlug, getRelatedArticles } from "@/lib/data/public-articles"
import { ArticleContent } from "@/components/site/article-content"
import { ArticleHeader } from "@/components/site/article-header"
import { RelatedArticles } from "@/components/site/related-articles"
import { ArticleProgress } from "@/components/site/article-progress"
import { ArticleAuthorBio } from "@/components/site/article-author-bio"
import { ArticleTableOfContents } from "@/components/site/article-table-of-contents"
import { CommentsSection } from "@/components/site/comments-section"
import { PopularArticlesWidget } from "@/components/site/popular-articles-widget"
import { StructuredData } from "@/components/seo/structured-data"
import { generateCanonicalUrl, generateKeywords } from "@/lib/utils/seo"
import { generateNewsArticleSchema, generateBreadcrumbSchema, generatePersonSchema } from "@/lib/utils/structured-data"
import { getLocaleFromSiteLanguage } from "@/lib/i18n"

type Props = {
  params: Promise<{ siteId: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId, slug } = await params
  const article = await getPublishedArticleBySlug(Number(siteId), slug)
  const site = await getSitePublicData(Number(siteId))

  if (!article || !site) {
    return {
      title: "Article Not Found",
    }
  }

  const locale = getLocaleFromSiteLanguage(site.language)
  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId), `/article/${slug}`)

  const keywords = generateKeywords(article.title, article.category, article.tags)

  return {
    title: article.title,
    description: article.meta_description || article.excerpt || undefined,
    keywords,
    authors: article.author_name ? [{ name: article.author_name }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: article.title,
      description: article.meta_description || article.excerpt || undefined,
      images: article.featured_image_url
        ? [
            {
              url: article.featured_image_url,
              width: 1200,
              height: 630,
              alt: article.featured_image_alt || article.title,
            },
          ]
        : undefined,
      type: "article",
      publishedTime: article.published_at?.toISOString(),
      modifiedTime: article.updated_at?.toISOString(),
      authors: article.author_name ? [article.author_name] : undefined,
      section: article.category || undefined,
      tags: article.tags || undefined,
      locale: locale || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
    other: {
      "content-language": locale || "en",
      "article:published_time": article.published_at?.toISOString() || "",
      "article:modified_time": article.updated_at?.toISOString() || article.published_at?.toISOString() || "",
      "article:author": article.author_name || "",
      "article:section": article.category || "",
      "article:tag": article.tags?.join(", ") || "",
      // AI-specific metadata for better content understanding
      "description": article.meta_description || article.excerpt || undefined,
      "summary": article.excerpt || undefined,
      "news_keywords": article.tags?.join(", ") || keywords,
      // Perplexity AI
      "perplexity:title": article.title,
      "perplexity:description": article.meta_description || article.excerpt || undefined,
      // Bing Chat / Copilot
      "microsoft:title": article.title,
      "microsoft:description": article.meta_description || article.excerpt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description || article.excerpt || undefined,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
      creator: site.twitter_handle ? `@${site.twitter_handle}` : undefined,
      site: site.twitter_handle ? `@${site.twitter_handle}` : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { siteId, slug } = await params
  const article = await getPublishedArticleBySlug(Number(siteId), slug)

  if (!article) {
    notFound()
  }

  const site = await getSitePublicData(Number(siteId))
  if (!site) {
    notFound()
  }

  const locale = getLocaleFromSiteLanguage(site.language)

  const relatedArticles = await getRelatedArticles(Number(siteId), article.id, article.category, 3)

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const articleSchema = generateNewsArticleSchema(article, siteUrl, site.name, site.logo_url || undefined, locale)

  const breadcrumbSchema = generateBreadcrumbSchema(siteUrl, site.name, [
    { name: "Home", url: siteUrl },
    ...(article.category
      ? [{ name: article.category, url: `${siteUrl}/category/${encodeURIComponent(article.category)}` }]
      : []),
    { name: article.title, url: `${siteUrl}/article/${article.slug}` },
  ])

  const authorSchema = article.author_name
    ? generatePersonSchema(article.author_name, article.author_bio, undefined)
    : null

  const structuredDataSchemas = [articleSchema, breadcrumbSchema, authorSchema].filter(Boolean)

  return (
    <>
      <StructuredData data={structuredDataSchemas} />

      <ArticleProgress />

      <div className="container mx-auto px-4 py-12" lang={locale}>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_300px]">
          {/* Main content */}
          <article className="max-w-4xl">
            <ArticleHeader article={article} siteUrl={siteUrl} />
            <ArticleContent content={article.content} />

            {/* Author bio section */}
            <ArticleAuthorBio
              authorName={article.author_name || "Anonymous"}
              authorBio={article.author_bio}
              authorEmail={article.author_email}
              siteId={Number(siteId)}
            />

            <CommentsSection articleId={article.id} />

            {relatedArticles.length > 0 && (
              <aside className="mt-16">
                <RelatedArticles articles={relatedArticles} siteId={Number(siteId)} />
              </aside>
            )}
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-[104px] space-y-5">
              <ArticleTableOfContents content={article.content} />

              {relatedArticles.length > 0 && (
                <PopularArticlesWidget
                  articles={relatedArticles}
                  siteId={Number(siteId)}
                  siteLanguage={site.language}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
