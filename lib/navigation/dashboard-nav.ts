import {
  LayoutDashboard,
  LifeBuoy,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export const dashboardNavMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
    items: [
      { title: "Organization", url: "/dashboard/settings/organization" },
      { title: "Billing", url: "/dashboard/settings/billing" },
      { title: "Mobile App", url: "/dashboard/settings/mobile-app" },
    ],
  },
];

export const dashboardNavSecondary: NavItem[] = [
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
];
