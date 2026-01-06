"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Author } from "@/lib/types/authors"

type AuthorSelectorProps = {
  value?: number
  onValueChange: (value: number | undefined) => void
  authors: Author[]
  disabled?: boolean
}

export function AuthorSelector({ value, onValueChange, authors, disabled }: AuthorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedAuthor = authors.find((author) => author.id === value)

  const filteredAuthors = authors.filter((author) => {
    const fullName = `${author.first_name} ${author.last_name}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-transparent"
        >
          {selectedAuthor ? `${selectedAuthor.first_name} ${selectedAuthor.last_name}` : "Select author..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search author..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No author found.</CommandEmpty>
            <CommandGroup>
              {filteredAuthors.map((author) => (
                <CommandItem
                  key={author.id}
                  value={`${author.first_name} ${author.last_name}`}
                  onSelect={() => {
                    onValueChange(author.id === value ? undefined : author.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === author.id ? "opacity-100" : "opacity-0")} />
                  {author.first_name} {author.last_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
