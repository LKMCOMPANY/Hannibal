"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Site } from "@/lib/db"

type MediaSelectorProps = {
  value?: number
  onValueChange: (value: number | undefined) => void
  sites: Site[]
}

export function MediaSelector({ value, onValueChange, sites }: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedSite = sites.find((site) => site.id === value)

  const filteredSites = sites.filter((site) => site.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedSite ? selectedSite.name : "Select media..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search media..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No media found.</CommandEmpty>
            <CommandGroup>
              {filteredSites.map((site) => (
                <CommandItem
                  key={site.id}
                  value={site.name}
                  onSelect={() => {
                    onValueChange(site.id === value ? undefined : site.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === site.id ? "opacity-100" : "opacity-0")} />
                  {site.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
