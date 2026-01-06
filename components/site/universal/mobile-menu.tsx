"use client"

import Link from "next/link"
import { Home, Newspaper, Info, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useDictionary } from "@/lib/i18n"

type MobileMenuProps = {
  categories: Array<{ label: string; value: string }>
  siteName: string
  siteId: number
  onLinkClick?: () => void
}

export function MobileMenu({ categories, siteName, siteId, onLinkClick }: MobileMenuProps) {
  const { t } = useDictionary()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 pb-8">
        <h2
          className="text-2xl font-bold leading-tight tracking-tight"
          style={{
            fontFamily: "var(--theme-font-heading)",
            color: "var(--theme-current-text)",
            fontWeight: "var(--theme-weight-bold)",
          }}
        >
          {siteName}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{
            fontFamily: "var(--theme-font-body)",
            color: "var(--theme-current-text-muted)",
            fontSize: "var(--theme-size-small)",
          }}
        >
          Explore our latest stories and insights
        </p>
      </div>

      <Separator
        className="mb-6"
        style={{
          backgroundColor: "var(--theme-current-border)",
          height: "1px",
        }}
      />

      <ScrollArea className="flex-1 -mx-6 px-6">
        <nav className="flex flex-col gap-2" aria-label={t("aria.mainNav")}>
          <Link
            href="/"
            onClick={onLinkClick}
            className={cn(
              "group flex items-center justify-between rounded-xl px-4 py-4 transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98] hover:bg-[var(--theme-current-surface)] hover:text-[var(--theme-current-primary)]"
            )}
            style={{
              fontFamily: "var(--theme-font-body)",
              color: "var(--theme-current-text)",
              fontWeight: "var(--theme-weight-semibold)",
              borderRadius: "var(--theme-radius-button)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 group-hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_12%,transparent)]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 5%, transparent)",
                  borderRadius: "var(--theme-radius-button)",
                }}
              >
                <Home className="h-5 w-5 transition-colors duration-200 group-hover:text-[var(--theme-current-primary)]" style={{ color: "var(--theme-current-text-muted)" }} />
              </div>
              <span className="text-base font-medium">{t("nav.home")}</span>
            </div>
            <ChevronRight
              className="h-5 w-5 opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
              style={{ color: "currentColor" }}
            />
          </Link>

          {/* Categories Section */}
          {categories.length > 0 && (
            <>
              <div
                className="mt-8 mb-4 px-4 text-xs font-bold uppercase tracking-widest"
                style={{
                  fontFamily: "var(--theme-font-body)",
                  color: "var(--theme-current-text-muted)",
                  fontWeight: "var(--theme-weight-bold)",
                  letterSpacing: "0.1em",
                }}
              >
                Categories
              </div>

              <div className="flex flex-col gap-1">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.value}
                    href={`/category/${encodeURIComponent(category.value)}`}
                    onClick={onLinkClick}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200",
                      "hover:scale-[1.02] active:scale-[0.98] hover:bg-[var(--theme-current-surface)] hover:text-[var(--theme-current-primary)]"
                    )}
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-current-text-secondary)",
                      fontWeight: "var(--theme-weight-medium)",
                      borderRadius: "var(--theme-radius-button)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 group-hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_12%,transparent)]"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 5%, transparent)",
                          borderRadius: "var(--theme-radius-button)",
                        }}
                      >
                        <Newspaper className="h-4 w-4 transition-colors duration-200 group-hover:text-[var(--theme-current-primary)]" style={{ color: "var(--theme-current-text-muted)" }} />
                      </div>
                      <span className="text-base">
                        {t(`category.${category.value.toLowerCase().replace(/\s+/g, "")}`, {
                          fallback: category.label,
                        })}
                      </span>
                    </div>
                    <ChevronRight
                      className="h-5 w-5 opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                      style={{ color: "currentColor" }}
                    />
                  </Link>
                ))}
              </div>
            </>
          )}

          <Separator
            className="my-8"
            style={{
              backgroundColor: "var(--theme-current-border)",
              height: "1px",
            }}
          />

          <Link
            href="/about"
            onClick={onLinkClick}
            className={cn(
              "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98] hover:bg-[var(--theme-current-surface)] hover:text-[var(--theme-current-primary)]"
            )}
            style={{
              fontFamily: "var(--theme-font-body)",
              color: "var(--theme-current-text-secondary)",
              fontWeight: "var(--theme-weight-medium)",
              borderRadius: "var(--theme-radius-button)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 group-hover:bg-[color-mix(in_srgb,var(--theme-current-primary)_12%,transparent)]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 5%, transparent)",
                  borderRadius: "var(--theme-radius-button)",
                }}
              >
                <Info className="h-5 w-5 transition-colors duration-200 group-hover:text-[var(--theme-current-primary)]" style={{ color: "var(--theme-current-text-muted)" }} />
              </div>
              <span className="text-base">{t("nav.about")}</span>
            </div>
            <ChevronRight
              className="h-5 w-5 opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
              style={{ color: "currentColor" }}
            />
          </Link>
        </nav>
      </ScrollArea>
    </div>
  )
}
