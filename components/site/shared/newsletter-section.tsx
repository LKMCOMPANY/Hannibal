"use client"

import type React from "react"
import { useState } from "react"
import { Mail, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDictionary } from "@/lib/i18n"

type NewsletterSectionProps = {
  siteName: string
}

export function NewsletterSection({ siteName }: NewsletterSectionProps) {
  const { t } = useDictionary()

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden border p-8"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        borderColor: "var(--theme-current-border)",
        borderRadius: "var(--theme-radius-card)",
        boxShadow: "var(--theme-shadow-card)",
      }}
    >
      <div
        className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 blur-3xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
          borderRadius: "var(--theme-radius-button)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 blur-2xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-current-accent) 10%, transparent)",
          borderRadius: "var(--theme-radius-button)",
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
              borderRadius: "var(--theme-radius-button)",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail className="h-6 w-6" style={{ color: "var(--theme-current-primary)" }} />
          </div>
          <div>
            <h2
              className="text-balance text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--theme-font-heading)",
                color: "var(--theme-current-text-primary)",
              }}
            >
              {t("article.stayInTheLoop")}
            </h2>
            <div
              className="flex items-center gap-1 text-sm"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-muted)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("article.joinThousands")}</span>
            </div>
          </div>
        </div>

        <p
          className="mb-6 text-pretty"
          style={{
            fontFamily: "var(--theme-font-body)",
            color: "var(--theme-current-text-secondary)",
            lineHeight: "1.7",
          }}
        >
          {t("article.getLatestStories", { siteName })}
        </p>

        {isSubmitted ? (
          <div
            className="flex items-center gap-3 p-4 text-green-800 dark:text-green-400"
            style={{
              backgroundColor: "color-mix(in srgb, green 10%, transparent)",
              borderRadius: "var(--theme-radius-card)",
            }}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{t("article.successfullySubscribed")}</p>
              <p className="text-sm opacity-90">{t("article.checkInbox")}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              style={{
                backgroundColor: "var(--theme-current-background)",
                borderColor: "var(--theme-current-border)",
                borderRadius: "var(--theme-radius-input)",
              }}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="transition-all duration-300 hover:shadow-lg sm:w-auto"
              style={{
                backgroundColor: "var(--theme-current-primary)",
                color: "white",
                borderRadius: "var(--theme-radius-button)",
              }}
            >
              {isLoading ? t("form.submitting") : t("action.subscribe")}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
