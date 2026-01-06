"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ARTICLE_CATEGORIES } from "@/lib/constants/categories"

type CategorySelectorProps = {
  value?: string
  onValueChange: (value: string) => void
  required?: boolean
  error?: string
}

export function CategorySelector({ value, onValueChange, required, error }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category {required && <span className="text-destructive">*</span>}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="category" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {ARTICLE_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
