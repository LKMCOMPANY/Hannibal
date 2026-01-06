"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState(100)

  useEffect(() => {
    const saved = localStorage.getItem("article-font-size")
    if (saved) {
      const size = Number.parseInt(saved)
      setFontSize(size)
      document.documentElement.style.setProperty("--article-font-scale", `${size}%`)
    }
  }, [])

  const updateFontSize = (newSize: number) => {
    const clamped = Math.max(80, Math.min(140, newSize))
    setFontSize(clamped)
    localStorage.setItem("article-font-size", clamped.toString())
    document.documentElement.style.setProperty("--article-font-scale", `${clamped}%`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Adjust font size"
          style={{
            borderRadius: "var(--theme-radius-button)",
          }}
        >
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <span className="text-sm text-muted-foreground">{fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => updateFontSize(fontSize - 10)}
                disabled={fontSize <= 80}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="flex-1">
                <input
                  type="range"
                  min="80"
                  max="140"
                  step="10"
                  value={fontSize}
                  onChange={(e) => updateFontSize(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => updateFontSize(fontSize + 10)}
                disabled={fontSize >= 140}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => updateFontSize(100)}>
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
