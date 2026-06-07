"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Search, Bell } from "lucide-react";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";

export function AppHeader() {
  return (
    <header className="flex sticky top-0 z-50 w-full h-14 items-center gap-4 border-b backdrop-blur-md px-4">
      {/* Sidebar Toggle */}

      <SidebarTrigger />

      {/* Breadcrumb */}

      <DynamicBreadcrumbs
        className="hidden md:flex"
        showHome={false}
        labelMap={{
          dashboard: "Dashboard",
          users: "Users",
          settings: "Settings",
        }}
      />

      {/* Spacer */}

      <div className="flex-1" />

      {/* Search */}

      <div className="relative w-64 hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input placeholder="Search assets, projects..." className="pl-9" />
      </div>

      {/* Notifications */}

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />

        {/* Notification Badge */}

        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>
    </header>
  );
}
