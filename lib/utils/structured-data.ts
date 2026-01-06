/**
 * Structured Data (JSON-LD) Generators
 *
 * Generate schema.org structured data for enhanced SEO and rich snippets.
 * Optimized for Google, Bing, and AI search engines.
 */

import type { PublicArticle } from "@/lib/data/public-articles"
import type { SitePublicData } from "@/lib/types/sites"
import { calculateReadingTime } from "./seo"

/**
 * Generate NewsArticle structured data
 */
export function generateNewsArticleSchema(
  article: PublicArticle,
  siteUrl: string,
  siteName: string,
  siteLogoUrl?: string,
  locale?: string,
) {
  const articleUrl = `${siteUrl}/article/${article.slug}`
  const readingTime = calculateReadingTime(article.content)

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.meta_description || article.excerpt || undefined,
    image: article.featured_image_url
      ? {
          "@type": "ImageObject",
          url: article.featured_image_url,
          width: 1200,
          height: 630,
          caption: article.featured_image_caption || undefined,
        }
      : undefined,
    datePublished: article.published_at?.toISOString(),
    dateModified: article.updated_at?.toISOString() || article.published_at?.toISOString(),
    author: article.author_name
      ? {
          "@type": "Person",
          name: article.author_name,
          description: article.author_bio || undefined,
        }
      : {
          "@type": "Organization",
          name: siteName,
        },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: siteLogoUrl
        ? {
            "@type": "ImageObject",
            url: siteLogoUrl,
          }
        : undefined,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.category || undefined,
    keywords: article.tags?.join(", ") || undefined,
    wordCount: article.content.split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: locale || "en",
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  siteUrl: string,
  siteName: string,
  breadcrumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Generate WebSite structured data with SearchAction
 */
export function generateWebSiteSchema(siteUrl: string, siteName: string, siteDescription?: string, locale?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription || undefined,
    url: siteUrl,
    inLanguage: locale || "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(site: SitePublicData, siteUrl: string) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description || undefined,
    url: siteUrl,
    logo: site.logo_url || undefined,
    contactPoint: site.contact_email
      ? {
          "@type": "ContactPoint",
          email: site.contact_email,
          contactType: "customer service",
        }
      : undefined,
    sameAs: site.twitter_url ? [site.twitter_url] : undefined,
  }

  // Add geo targeting if country is specified
  if (site.country) {
    schema.areaServed = {
      "@type": "Country",
      name: site.country,
    }
  }

  return schema
}

/**
 * Generate Place/LocalBusiness schema for geo-targeted sites
 */
export function generatePlaceSchema(
  siteName: string,
  country: string,
  countryIso2: string,
  siteUrl: string,
  contactEmail?: string | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: siteName,
    address: {
      "@type": "PostalAddress",
      addressCountry: countryIso2,
    },
    geo: {
      "@type": "GeoCoordinates",
      // These would ideally come from database, using defaults
      addressCountry: countryIso2,
    },
    url: siteUrl,
    email: contactEmail || undefined,
  }
}

/**
 * Generate AggregateRating schema
 * For articles with user ratings/reviews
 */
export function generateAggregateRatingSchema(
  ratingValue: number,
  reviewCount: number,
  bestRating = 5,
  worstRating = 1,
) {
  return {
    "@type": "AggregateRating",
    ratingValue: ratingValue.toFixed(1),
    reviewCount,
    bestRating,
    worstRating,
  }
}

/**
 * Generate Review schema for article reviews
 */
export function generateReviewSchema(
  reviewAuthor: string,
  reviewBody: string,
  reviewRating: number,
  reviewDate: string,
) {
  return {
    "@type": "Review",
    author: {
      "@type": "Person",
      name: reviewAuthor,
    },
    datePublished: reviewDate,
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: reviewRating,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

/**
 * Generate Person (Author) structured data
 */
export function generatePersonSchema(
  authorName: string,
  authorBio?: string | null,
  authorEmail?: string | null,
  authorImage?: string | null,
  authorSocials?: {
    twitter?: string
    linkedin?: string
    website?: string
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    description: authorBio || undefined,
    email: authorEmail || undefined,
    image: authorImage || undefined,
    sameAs: authorSocials
      ? [authorSocials.twitter, authorSocials.linkedin, authorSocials.website].filter(Boolean)
      : undefined,
    jobTitle: "Journalist",
  }
}

/**
 * Generate CollectionPage structured data for category pages
 */
export function generateCollectionPageSchema(
  siteUrl: string,
  siteName: string,
  category: string,
  articleCount: number,
  locale?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} - ${siteName}`,
    description: `Browse all ${category} articles on ${siteName}`,
    url: `${siteUrl}/category/${encodeURIComponent(category)}`,
    inLanguage: locale || "en",
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
    numberOfItems: articleCount,
  }
}

/**
 * Generate FAQPage structured data
 * For articles formatted as Q&A
 */
export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>,
  articleUrl: string,
  articleTitle: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: articleTitle,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate VideoObject structured data
 * For articles with embedded videos (YouTube, Vimeo, etc.)
 */
export function generateVideoObjectSchema(
  videoUrl: string,
  videoTitle: string,
  videoDescription: string,
  thumbnailUrl: string,
  uploadDate?: string,
  duration?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: videoTitle,
    description: videoDescription,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate || new Date().toISOString(),
    contentUrl: videoUrl,
    embedUrl: videoUrl,
    duration: duration || undefined, // Format: PT1M30S (1min 30sec)
  }
}

/**
 * Generate ItemList structured data for article listings
 * Used on homepage and category pages for rich snippets
 */
export function generateItemListSchema(
  articles: Array<{
    id: number
    title: string
    slug: string
    excerpt: string | null
    featured_image_url: string | null
    category: string | null
    published_at: Date | null
  }>,
  siteUrl: string,
  listName: string,
  listDescription?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    description: listDescription || undefined,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        "@id": `${siteUrl}/article/${article.slug}`,
        headline: article.title,
        description: article.excerpt || undefined,
        image: article.featured_image_url || undefined,
        datePublished: article.published_at?.toISOString(),
        url: `${siteUrl}/article/${article.slug}`,
      },
    })),
    numberOfItems: articles.length,
  }
}
