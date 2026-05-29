"use server";

import { AppHeader } from "@/components/sidebar/app-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-background">
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
