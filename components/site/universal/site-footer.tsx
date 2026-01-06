"use client"

import Link from "next/link"
import { Twitter, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import type { SitePublicData } from "@/lib/site-resolver"
import { NewsletterSignup } from "../newsletter-signup"
import { useDictionary } from "@/lib/i18n"

type Props = {
  site: SitePublicData
}

export function SiteFooter({ site }: Props) {
  const { t, locale } = useDictionary()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: "var(--theme-current-border)",
        backgroundColor: "var(--theme-current-surface)",
      }}
    >
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1.5fr] lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3
              className="text-balance"
              style={{
                fontSize: "var(--theme-text-h4)",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
                color: "var(--theme-current-text-primary)",
              }}
            >
              {site.name}
            </h3>
            {site.description && (
              <p
                className="max-w-md text-sm leading-relaxed text-pretty"
                style={{
                  fontFamily: "var(--theme-font-body)",
                  color: "var(--theme-current-text-secondary)",
                  lineHeight: "var(--theme-leading-relaxed)",
                }}
              >
                {site.description}
              </p>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {site.twitter_url && (
                <a
                  href={site.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_10%,transparent)] hover:text-[var(--theme-current-primary)]"
                  style={{
                    backgroundColor: "var(--theme-current-surface)",
                    color: "var(--theme-current-text-secondary)",
                    border: "1px solid var(--theme-current-border)",
                  }}
                  aria-label={t("social.twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {site.facebook_url && (
                <a
                  href={site.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_10%,transparent)] hover:text-[var(--theme-current-primary)]"
                  style={{
                    backgroundColor: "var(--theme-current-surface)",
                    color: "var(--theme-current-text-secondary)",
                    border: "1px solid var(--theme-current-border)",
                  }}
                  aria-label={t("social.facebook")}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {site.instagram_url && (
                <a
                  href={site.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_10%,transparent)] hover:text-[var(--theme-current-primary)]"
                  style={{
                    backgroundColor: "var(--theme-current-surface)",
                    color: "var(--theme-current-text-secondary)",
                    border: "1px solid var(--theme-current-border)",
                  }}
                  aria-label={t("social.instagram")}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {site.linkedin_url && (
                <a
                  href={site.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_10%,transparent)] hover:text-[var(--theme-current-primary)]"
                  style={{
                    backgroundColor: "var(--theme-current-surface)",
                    color: "var(--theme-current-text-secondary)",
                    border: "1px solid var(--theme-current-border)",
                  }}
                  aria-label={t("social.linkedin")}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4
              style={{
                fontSize: "var(--theme-text-small)",
                fontFamily: "var(--theme-font-body)",
                fontWeight: "var(--theme-weight-semibold)",
                color: "var(--theme-current-text-primary)",
                textTransform: "uppercase",
                letterSpacing: "var(--theme-tracking-wide)",
              }}
              lang={locale}
            >
              {t("footer.quickLinks")}
            </h4>
            <nav className="flex flex-col gap-3" aria-label={t("aria.footerNav")}>
              {[
                { href: "/", label: t("nav.home") },
                { href: "/about", label: t("nav.about") },
                { href: "/contact", label: t("nav.contact") },
                { href: "/privacy", label: t("nav.privacy") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors hover:text-[var(--theme-current-primary)]"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color: "var(--theme-current-text-secondary)",
                    transitionDuration: "var(--theme-transition)",
                  }}
                  lang={locale}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4
              style={{
                fontSize: "var(--theme-text-small)",
                fontFamily: "var(--theme-font-body)",
                fontWeight: "var(--theme-weight-semibold)",
                color: "var(--theme-current-text-primary)",
                textTransform: "uppercase",
                letterSpacing: "var(--theme-tracking-wide)",
              }}
            >
              {t("footer.contact")}
            </h4>
            <div className="flex flex-col gap-3">
              {site.contact_email && (
                <a
                  href={`mailto:${site.contact_email}`}
                  className="flex items-center gap-2 text-sm transition-colors duration-300 hover:text-[var(--theme-current-primary)] hover:translate-x-1"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color: "var(--theme-current-text-secondary)",
                    transitionDuration: "var(--theme-transition)",
                  }}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">{site.contact_email}</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <NewsletterSignup siteId={site.id} siteName={site.name} />
          </div>
        </div>

        <div
          className="mt-12 border-t pt-8"
          style={{
            borderColor: "var(--theme-current-border)",
          }}
        >
          <p
            className="text-center text-sm"
            style={{
              fontFamily: "var(--theme-font-body)",
              color: "var(--theme-current-text-muted)",
            }}
            lang={locale}
          >
            {t("footer.copyright", { year: currentYear.toString(), siteName: site.name })}
          </p>
        </div>
      </div>
    </footer>
  )
}
