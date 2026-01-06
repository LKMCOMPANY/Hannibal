import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticles, getSiteCategories } from "@/lib/data/public-articles"
import { getThemeComponents } from "@/lib/theme-resolver"
import { CategoryNav } from "@/components/site/shared/category-nav"
import { TrendingSidebar } from "@/components/site/shared/trending-sidebar"
import { NewsletterSection } from "@/components/site/shared/newsletter-section"
import { IntersectionObserverWrapper } from "@/components/site/intersection-observer"
import { generateCanonicalUrl } from "@/lib/utils/seo"
import { getDictionary, getLocaleFromSite } from "@/lib/i18n"
import { StructuredData } from "@/components/seo/structured-data"
import { generateItemListSchema } from "@/lib/utils/structured-data"

type Props = {
  params: Promise<{ siteId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      title: "Site Not Found",
    }
  }

  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId))

  return {
    title: site.name,
    description: site.description || `Latest news and articles from ${site.name}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: site.name,
      description: site.description || `Latest news and articles from ${site.name}`,
      images: site.thumbnail_image_url ? [site.thumbnail_image_url] : undefined,
      type: "website",
      locale: site.language || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
  }
}

export default async function SiteHomePage({ params }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    notFound()
  }

  const locale = getLocaleFromSite(site.language)
  const dict = await getDictionary(locale)

  const [articles, categories] = await Promise.all([
    getPublishedArticles(Number(siteId), 30),
    getSiteCategories(Number(siteId)),
  ])

  const { SiteHero, ArticleGrid } = await getThemeComponents(site.theme_layout)

  const [featuredArticle, ...remainingArticles] = articles
  const trendingArticles = articles.slice(0, 6)

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  // ItemList Schema for homepage articles
  const itemListSchema = generateItemListSchema(
    articles.slice(0, 20),
    siteUrl,
    `Latest Articles - ${site.name}`,
    `Recent news and articles from ${site.name}`,
  )

  return (
    <>
      <StructuredData data={itemListSchema} />
      
      <CategoryNav categories={categories} siteId={Number(siteId)} />

      <div className="container mx-auto px-4 py-8">
        <IntersectionObserverWrapper animationClass="animate-fade-in">
          <SiteHero article={featuredArticle || null} siteId={Number(siteId)} />
        </IntersectionObserverWrapper>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content Column */}
          <div className="min-w-0">
            <section>
              <IntersectionObserverWrapper animationClass="animate-fade-in-up">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">{dict.article.latestStories}</h2>
                  <div className="ml-8 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>
              </IntersectionObserverWrapper>
              <ArticleGrid articles={remainingArticles} siteId={Number(siteId)} />
            </section>

            <IntersectionObserverWrapper animationClass="animate-fade-in-up" className="mt-16">
              <NewsletterSection siteName={site.name} />
            </IntersectionObserverWrapper>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[104px]">
              <IntersectionObserverWrapper animationClass="animate-slide-in-right">
                <TrendingSidebar articles={trendingArticles} siteId={Number(siteId)} />
              </IntersectionObserverWrapper>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
