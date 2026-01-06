import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticlesByCategory, getPublishedArticlesCountByCategory } from "@/lib/data/public-articles"
import { getThemeComponents } from "@/lib/theme-resolver"
import { StructuredData } from "@/components/seo/structured-data"
import { generateCanonicalUrl } from "@/lib/utils/seo"
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/utils/structured-data"
import { getDictionary, getLocaleFromSiteLanguage } from "@/lib/i18n"
import { getCategoryKey } from "@/lib/i18n/utils/category-key"

type Props = {
  params: Promise<{ siteId: string; category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId, category } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      title: "Category Not Found",
    }
  }

  const decodedCategory = decodeURIComponent(category)
  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId), `/category/${category}`)

  return {
    title: `${decodedCategory} Articles`,
    description: `Browse all ${decodedCategory} articles on ${site.name}`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${decodedCategory} Articles - ${site.name}`,
      description: `Browse all ${decodedCategory} articles on ${site.name}`,
      type: "website",
      locale: site.language || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { siteId, category } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    notFound()
  }

  const locale = getLocaleFromSiteLanguage(site.language)
  const dictionary = await getDictionary(locale)

  // Helper function for server-side translation
  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split(".")
    let value: any = dictionary
    for (const k of keys) {
      value = value?.[k]
    }
    if (typeof value === "string" && params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => params[k] || `{${k}}`)
    }
    return value || key
  }

  const decodedCategory = decodeURIComponent(category)
  const articles = await getPublishedArticlesByCategory(Number(siteId), decodedCategory, 20)
  const count = await getPublishedArticlesCountByCategory(Number(siteId), decodedCategory)

  const { ArticleGrid } = await getThemeComponents(site.theme_layout)

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const collectionSchema = generateCollectionPageSchema(siteUrl, site.name, decodedCategory, count, locale)
  const breadcrumbSchema = generateBreadcrumbSchema(siteUrl, site.name, [
    { name: "Home", url: siteUrl },
    { name: decodedCategory, url: `${siteUrl}/category/${category}` },
  ])
  
  // ItemList Schema for category articles
  const itemListSchema = generateItemListSchema(
    articles,
    siteUrl,
    `${decodedCategory} Articles`,
    `${decodedCategory} articles from ${site.name}`,
  )

  const translatedCategory = t(`category.${getCategoryKey(decodedCategory)}`) || decodedCategory

  return (
    <>
      <StructuredData data={[collectionSchema, breadcrumbSchema, itemListSchema]} />

      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="typography-h1 mb-4 text-balance">{translatedCategory}</h1>
          <p className="typography-muted">
            {count === 1
              ? t("categoryPage.articlesCount", { count: count.toString() })
              : t("categoryPage.articlesCountPlural", { count: count.toString() })}
          </p>
        </header>

        <ArticleGrid articles={articles} siteId={Number(siteId)} />
      </div>
    </>
  )
}
