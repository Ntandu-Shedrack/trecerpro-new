"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Search, Bell } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: segment.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      href,
    };
  });

  return (
    <header className="flex sticky top-0 z-50 w-full h-14 items-center gap-4 border-b backdrop-blur-md px-4">
      {/* Sidebar Toggle */}

      <SidebarTrigger />

      {/* Breadcrumb */}

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem> */}

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={crumb.href} className="flex items-center">
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

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
