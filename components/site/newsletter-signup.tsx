"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDictionary } from "@/lib/i18n"

type Props = {
  siteId: number
  siteName: string
}

export function NewsletterSignup({ siteId, siteName }: Props) {
  const { t } = useDictionary()

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, siteId }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage(t("newsletter.success"))
        setEmail("")
      } else {
        setStatus("error")
        setMessage(t("newsletter.error"))
      }
    } catch (error) {
      setStatus("error")
      setMessage(t("newsletter.error"))
    }

    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 3000)
  }

  return (
    <Card
      className="border-2"
      style={{
        borderColor: "var(--theme-current-primary)",
        backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 5%, var(--theme-current-surface))",
        borderRadius: "var(--theme-radius-card)",
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: "var(--theme-current-primary)",
              color: "white",
              borderRadius: "var(--theme-radius-button)",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <CardTitle
              style={{
                fontFamily: "var(--theme-font-heading)",
                color: "var(--theme-current-text-primary)",
              }}
            >
              {t("newsletter.title")}
            </CardTitle>
            <CardDescription
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-secondary)",
              }}
            >
              {t("newsletter.description", { siteName })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder={t("newsletter.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            required
            className="h-11"
            style={{
              borderRadius: "var(--theme-radius-input)",
            }}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || status === "success"}
            style={{
              backgroundColor: "var(--theme-current-primary)",
              color: "white",
              borderRadius: "var(--theme-radius-button)",
            }}
          >
            {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "success" && <Check className="mr-2 h-4 w-4" />}
            {status === "success" ? t("action.subscribed") : t("action.subscribe")}
          </Button>
          {message && (
            <p
              className={`text-center text-sm ${
                status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
