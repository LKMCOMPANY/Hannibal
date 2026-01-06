import type React from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { getSitePublicData, getArticleCategories } from "@/lib/site-resolver"
import { getThemeComponents, normalizeThemePreset } from "@/lib/theme-resolver"
import { ThemeInjector } from "@/lib/themes/theme-injector"
import { BreakingNewsTicker } from "@/components/site/shared/breaking-news-ticker"
import { getPublishedArticles } from "@/lib/data/public-articles"
import { ScrollToTop } from "@/components/site/scroll-to-top"
import { KeyboardShortcuts } from "@/components/site/keyboard-shortcuts"
import { StructuredData } from "@/components/seo/structured-data"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { generateCanonicalUrl } from "@/lib/utils/seo"
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/utils/structured-data"
import { getDictionary, getLocaleFromSiteLanguage, LanguageProvider, LOCALE_CONFIGS } from "@/lib/i18n"

type Props = {
  params: Promise<{ siteId: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      title: "Site Not Found",
    }
  }

  const locale = getLocaleFromSiteLanguage(site.language)
  const canonicalUrl = generateCanonicalUrl(site.custom_domain, Number(siteId))

  return {
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description || undefined,
    icons: site.logo_url
      ? {
          icon: [
            { url: site.logo_url, sizes: "32x32", type: "image/png" },
            { url: site.logo_url, sizes: "16x16", type: "image/png" },
            { url: site.logo_url, sizes: "any" },
          ],
          apple: [
            { url: site.logo_url, sizes: "180x180", type: "image/png" },
            { url: site.logo_url, sizes: "152x152", type: "image/png" },
            { url: site.logo_url, sizes: "120x120", type: "image/png" },
          ],
          shortcut: site.logo_url,
          other: [
            {
              rel: "mask-icon",
              url: site.logo_url,
            },
          ],
        }
      : undefined,
    manifest: `/site/${siteId}/manifest.json`,
    alternates: {
      canonical: canonicalUrl,
      ...(site.custom_domain
        ? {
            canonical: `https://${site.custom_domain}`,
          }
        : {}),
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
      title: site.name,
      description: site.description || undefined,
      images: site.thumbnail_image_url ? [site.thumbnail_image_url] : undefined,
      type: "website",
      locale: locale || "en",
      siteName: site.name,
      url: canonicalUrl,
    },
    other: {
      "content-language": locale || "en",
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description || undefined,
      images: site.thumbnail_image_url ? [site.thumbnail_image_url] : undefined,
      site: site.twitter_handle ? `@${site.twitter_handle}` : undefined,
    },
    ...(site.ga4_measurement_id
      ? {
          other: {
            "google-site-verification": site.ga4_measurement_id,
          },
        }
      : {}),
  }
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
  }
}

export default async function SiteLayout({ params, children }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    notFound()
  }

  console.log("[v0] SiteLayout - Site ID:", siteId)
  console.log("[v0] SiteLayout - Site language from DB:", site.language)
  console.log("[v0] SiteLayout - Site name:", site.name)

  const locale = getLocaleFromSiteLanguage(site.language)
  const dictionary = await getDictionary(locale)
  const localeConfig = LOCALE_CONFIGS[locale]

  console.log("[v0] SiteLayout - Resolved locale:", locale)
  console.log("[v0] SiteLayout - Locale config:", localeConfig)
  console.log("[v0] SiteLayout - Dictionary sample:", {
    navHome: dictionary.nav.home,
    categoryBusiness: dictionary.category.business,
  })

  const { SiteHeader, SiteFooter } = await getThemeComponents(site.theme_layout)

  const themePreset = normalizeThemePreset(site.theme_layout)
  const themeOverrides = {
    primaryColor: site.theme_primary_color || undefined,
    accentColor: site.theme_accent_color || undefined,
  }

  const [breakingNews, categories] = await Promise.all([
    getPublishedArticles(Number(siteId), 5),
    getArticleCategories(Number(siteId)),
  ])

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const websiteSchema = generateWebSiteSchema(siteUrl, site.name, site.description || undefined, locale)
  const organizationSchema = generateOrganizationSchema(site, siteUrl)

  return (
    <>
      <StructuredData data={[websiteSchema, organizationSchema]} />

      {site.ga4_measurement_id && <GoogleAnalytics measurementId={site.ga4_measurement_id} />}

      <ThemeInjector preset={themePreset} overrides={themeOverrides} />
      <KeyboardShortcuts />

      <LanguageProvider locale={locale} dictionary={dictionary} direction={localeConfig.direction}>
        <div className="flex min-h-screen flex-col light" lang={locale} dir={localeConfig.direction}>
          <SiteHeader site={site} categories={categories} />
          <BreakingNewsTicker articles={breakingNews} siteId={Number(siteId)} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter site={site} />
        </div>
      </LanguageProvider>

      <ScrollToTop />
    </>
  )
}
