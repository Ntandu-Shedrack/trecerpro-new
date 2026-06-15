import { AppHeader } from "@/components/sidebar/app-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-muted/50 min-h-screen">
      <AppSidebar variant="inset" />

      <SidebarInset className="md:h-[calc(100svh-1rem)] border border-sidebar-border bg-background shadow-xs overflow-hidden relative">
        <AppHeader />

        <div className="h-full overflow-y-auto pt-20 px-6 pb-6">{children}</div>
        <Toaster position="top-right" richColors closeButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
