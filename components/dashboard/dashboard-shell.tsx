"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import React from "react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-background">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col px-4 py-2 md:px-8 md:py-4">
            <div className="mx-auto w-full">{children}</div>
          </main>
        </SidebarInset>
        <Toaster position="top-right" richColors closeButton />
      </SidebarProvider>
    </div>
  );
}
