"use client";

import { SidebarIcon } from "lucide-react";
import { SearchForm } from "@/components/sidebar/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { DynamicBreadcrumbs } from "./dynamic-breadcrumbs";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex w-full h-[var(--header-height)] items-center border-b bg-transparent backdrop-blur-xs">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <DynamicBreadcrumbs
          className="hidden sm:block"
          labelMap={{
            dashboard: "Dashboard",
            users: "Users",
            settings: "Settings",
          }}
        />

        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}
