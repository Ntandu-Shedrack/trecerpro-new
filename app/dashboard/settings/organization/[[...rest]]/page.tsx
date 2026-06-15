"use client";

import {
  Building2,
  CreditCard,
  Shield,
  Users,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GeneralTab from "@/components/dashboard/settings/organization/general-tab";
import MembersTab from "@/components/dashboard/settings/organization/members-tab";
import DangerZoneTab from "@/components/dashboard/settings/organization/dangerzone-tab";

const TABS = [
  { value: "general", label: "General", icon: Building2 },
  { value: "members", label: "Members & Invitations", icon: Users },
  { value: "settings", label: "Settings", icon: Shield },
] as const;

export default function OrganizationSettingsPage() {
  return (
    <div className="mx-auto space-y-6 py-4 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Organization Workspace Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace, members, and account settings.
        </p>
      </div>
      <Separator />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="h-auto gap-1 p-1 w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 px-4 py-2 text-sm w-full"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab />
        </TabsContent>

        <TabsContent value="settings">
          <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
