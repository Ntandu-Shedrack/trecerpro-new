"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  LayoutDashboard,
  FolderKanban,
  Boxes,
  Barcode,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  User,
  LogOut,
  ScanBarcode,
  LayoutList,
  Shapes,
  FileUp,
  UsersRound,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  /* -----------------------------
     ACTIVE ROUTE MATCHER
  ----------------------------- */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  /* -----------------------------
     NAVIGATION CONFIG
  ----------------------------- */
  const mainNav = [
    { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
    { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
  ];

  const assetItems = [
    {
      title: "Assets List",
      url: "/dashboard/assets/list",
      icon: LayoutList,
      match: "prefix",
    },
    {
      title: "Categories",
      url: "/dashboard/assets/categories",
      icon: Shapes,
      match: "exact",
    },
    {
      title: "Bulk Upload",
      url: "/dashboard/assets/bulk-upload",
      icon: FileUp,
      match: "exact",
    },
  ];

  const operations = [
    {
      title: "Barcode Management",
      url: "/dashboard/operations/barcode-management",
      icon: Barcode,
    },
    {
      title: "Users & Roles",
      url: "/dashboard/users",
      icon: UsersRound,
    },
    { title: "Reports", url: "/dashboard/operations/reports", icon: BarChart3 },
    {
      title: "Administration",
      url: "/dashboard/operations/admin",
      icon: Settings,
    },
  ];

  const assetSectionActive = assetItems.some((item) =>
    item.match === "prefix"
      ? pathname.startsWith(item.url)
      : pathname === item.url,
  );

  /* -----------------------------
     SIDEBAR
  ----------------------------- */
  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="space-y-4">
        <div className="flex items-center gap-2 px-4 py-4">
          <ScanBarcode className="h-8 w-8 text-primary" />
          {!collapsed && (
            <span className="font-semibold text-2xl">TracerPro</span>
          )}
        </div>

        {/* PROJECT SWITCHER */}
        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip="Projects">
                <FolderKanban />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <DropdownMenuItem>Alpha Development</DropdownMenuItem>
              <DropdownMenuItem>Beta Testing</DropdownMenuItem>
              <DropdownMenuItem>Production</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full rounded-md border px-3 py-2 text-sm hover:bg-muted transition">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    Active Project
                  </span>
                  <span className="font-medium">Alpha Development</span>
                </div>
                <ChevronsUpDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>Alpha Development</DropdownMenuItem>
              <DropdownMenuItem>Beta Testing</DropdownMenuItem>
              <DropdownMenuItem>Production</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {/* MAIN NAVIGATION */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                        active && "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            active
                              ? "text-primary opacity-100"
                              : "opacity-70 text-foreground",
                          )}
                        />
                        {!collapsed && <span>{item.title}</span>}
                        {active && !collapsed && (
                          <span className="absolute left-0 h-6 w-1 bg-primary rounded-r" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ASSET MANAGEMENT */}
        <Collapsible
          defaultOpen={assetSectionActive}
          className="group/collapsible"
        >
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger
                  className={cn(
                    "flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all",
                    assetSectionActive &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <Boxes className="h-4 w-4" />
                  <span>Asset Management</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            )}
            <CollapsibleContent>
              <SidebarGroupContent className="pt-1">
                <SidebarMenu>
                  {assetItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      item.match === "prefix"
                        ? pathname.startsWith(item.url)
                        : pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={cn(
                            "relative flex items-center gap-3 pl-6 py-2 rounded-md transition-all",
                            active && "bg-primary/10 text-primary font-medium",
                          )}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3 w-full"
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4 transition-colors",
                                active
                                  ? "text-primary opacity-100"
                                  : "opacity-70 text-foreground",
                              )}
                            />
                            {!collapsed && <span>{item.title}</span>}
                            {active && !collapsed && (
                              <span className="absolute left-0 h-6 w-1 bg-primary rounded-r" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* OPERATIONS */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Operations</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {operations.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                        active && "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            active
                              ? "text-primary opacity-100"
                              : "opacity-70 text-foreground",
                          )}
                        />
                        {!collapsed && <span>{item.title}</span>}
                        {active && !collapsed && (
                          <span className="absolute left-0 h-6 w-1 bg-primary rounded-r" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        {collapsed ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Account">
                <User />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout">
                <LogOut />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              AR
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Alex Reed</span>
              <span className="text-[10px] text-muted-foreground">
                System Admin
              </span>
            </div>
            <button className="ml-auto text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
