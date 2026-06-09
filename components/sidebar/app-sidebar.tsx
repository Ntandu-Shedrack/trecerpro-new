"use client";

import * as React from "react";
import { useCurrentOrganization } from "@/context/auth-context";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CustomOrgSwitcher } from "../dashboard/settings/organization/custom-org-switcher";
import {
  dashboardNavMain,
  dashboardNavSecondary,
} from "@/lib/navigation/dashboard-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { organization } = useCurrentOrganization();

  return (
    <Sidebar className="top-0 min-h-screen" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <CustomOrgSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardNavMain} />
        <NavProjects organizationId={organization?.id} />
        <NavSecondary items={dashboardNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
