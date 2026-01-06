"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Search } from "lucide-react"
import { XLogo } from "@/components/site/icons/x-logo"
import type { SitePublicData } from "@/lib/site-resolver"
import type { ArticleCategory } from "@/lib/types/sites"
import { MobileMenu } from "./mobile-menu"
import { SiteSearch } from "../site-search"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useDictionary, getCategoryKey } from "@/lib/i18n"

type Props = {
  site: SitePublicData
  categories: ArticleCategory[]
}

export function SiteHeader({ site, categories }: Props) {
  const { t, locale } = useDictionary()

  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300 will-change-transform",
          isScrolled && "shadow-sm backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-opacity-80",
        )}
        style={{
          borderColor: isScrolled ? "var(--theme-current-border)" : "transparent",
          backgroundColor: isScrolled
            ? "color-mix(in srgb, var(--theme-current-bg) 85%, transparent)"
            : "var(--theme-current-bg)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center transition-opacity hover:opacity-80 touch-target"
              aria-label={`${site.name} home`}
            >
              {site.logo_url ? (
                <Image
                  src={site.logo_url || "/placeholder.svg"}
                  alt={`${site.name} logo`}
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain lg:h-12"
                  priority
                  quality={100}
                  unoptimized={site.logo_url.endsWith('.svg')}
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center text-white shadow-sm lg:h-12 lg:w-12"
                  style={{
                    borderRadius: "var(--theme-radius-button)",
                    background: `linear-gradient(135deg, var(--theme-current-primary), var(--theme-current-accent))`,
                    fontFamily: "var(--theme-font-heading)",
                    fontWeight: "var(--theme-weight-bold)",
                    fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                  }}
                >
                  {site.name.charAt(0)}
                </div>
              )}
            </Link>

            <NavigationMenu className="hidden lg:flex" viewport={false}>
              <NavigationMenuList className="gap-1">
                {categories.slice(0, 6).map((category) => (
                  <NavigationMenuItem key={category.value}>
                    <Link href={`/category/${encodeURIComponent(category.value)}`} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group relative inline-flex h-10 items-center justify-center px-5 py-2",
                          "text-sm font-bold uppercase tracking-wide transition-all duration-200",
                          "rounded-md hover:bg-transparent focus:bg-transparent",
                          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        )}
                        style={{
                          color: "var(--theme-current-text-secondary)",
                          fontFamily: "var(--theme-font-heading)",
                          letterSpacing: "0.05em",
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as HTMLElement
                          target.style.color = "var(--theme-current-primary)"
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as HTMLElement
                          target.style.color = "var(--theme-current-text-secondary)"
                        }}
                        lang={locale}
                      >
                        <span className="relative z-10">
                          {t(`category.${getCategoryKey(category.value)}`, { fallback: category.label })}
                        </span>
                        <span
                          className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
                          style={{
                            backgroundColor: "var(--theme-current-primary)",
                          }}
                        />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-1">
              {site.twitter_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-10 w-10 transition-colors hover:bg-transparent"
                  aria-label={t("aria.followOnX", { siteName: site.name })}
                >
                  <a
                    href={site.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                    style={{
                      color: "var(--theme-current-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--theme-current-primary)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                    }}
                  >
                    <XLogo className="h-5 w-5" />
                  </a>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="h-10 w-10 transition-colors hover:bg-transparent"
                aria-label={t("aria.search")}
                style={{
                  color: "var(--theme-current-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--theme-current-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                }}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 transition-colors hover:bg-transparent"
                    aria-label={t("aria.openMenu")}
                    style={{
                      color: "var(--theme-current-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--theme-current-primary)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-96 p-6"
                  style={{
                    backgroundColor: "var(--theme-current-bg)",
                    borderLeft: "1px solid var(--theme-current-border)",
                  }}
                >
                  <MobileMenu
                    categories={categories}
                    siteName={site.name}
                    siteId={site.id}
                    onLinkClick={() => setMobileMenuOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <SiteSearch siteId={site.id} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
