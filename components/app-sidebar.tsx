"use client"

import React from "react"

import { Home, Newspaper, FileText, PenSquare, Megaphone, Search, Bot } from "lucide-react"

// X Logo Component (official new logo)
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navSections = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Search",
        url: "/dashboard/search",
        icon: Search,
      },
    ],
  },
  {
    items: [
      {
        title: "Medias",
        url: "/dashboard/medias",
        icon: Newspaper,
      },
      {
        title: "Articles",
        url: "/dashboard/articles",
        icon: FileText,
      },
      {
        title: "Autonomous Media",
        url: "/dashboard/autonomous-media",
        icon: Bot,
      },
      {
        title: "X Publisher",
        url: "/dashboard/x-publisher",
        icon: XLogo,
      },
    ],
  },
  {
    items: [
      {
        title: "Publish",
        url: "/dashboard/publish",
        icon: PenSquare,
      },
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
        icon: Megaphone,
      },
    ],
  },
]

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props} aria-label="Main navigation">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Hannibal</h2>
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} aria-label={`Navigate to ${item.title}`}>
                          <item.icon className="h-4 w-4" aria-hidden="true" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {/* Add separator between sections, but not after the last one */}
            {sectionIndex < navSections.length - 1 && <SidebarSeparator />}
          </React.Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-4">
        <Button asChild className="w-full">
          <a href="/dashboard/publish">
            <PenSquare className="mr-2 h-4 w-4" />
            Publish
          </a>
        </Button>
        <p className="text-xs text-muted-foreground text-center">© 2025 Hannibal</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
