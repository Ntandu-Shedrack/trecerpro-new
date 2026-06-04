"use client";

import { CreditCard, History, Activity } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PlansTab from "@/components/dashboard/settings/billing/plans-tab";
import UsageTab from "@/components/dashboard/settings/billing/usage-tab";
import InvoicesTab from "@/components/dashboard/settings/billing/invoices-tab";
import { useParams, useRouter } from "next/navigation";

const TABS = [
  { value: "plans", label: "Subscription & Plans", icon: CreditCard },
  { value: "usage", label: "Usage & Limits", icon: Activity },
  { value: "invoices", label: "Billing History", icon: History },
] as const;

export default function BillingSettingsPage() {
  const params = useParams();
  const router = useRouter();
  
  // rest is an array from [[...rest]]
  const rest = params?.rest as string[] | undefined;
  const currentTab = rest?.[0] || "plans";

  const handleTabChange = (value: string) => {
    if (value === "plans") {
      router.push("/dashboard/settings/billing");
    } else {
      router.push(`/dashboard/settings/billing/${value}`);
    }
  };

  return (
    <div className="mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Organization Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your organization&apos;s subscription, usage limits, and billing history.
        </p>
      </div>
      <Separator />

      <Tabs 
        value={currentTab} 
        onValueChange={handleTabChange}
        className="space-y-6"
      >
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

        <TabsContent value="plans" className="mt-0 outline-none">
          <PlansTab />
        </TabsContent>

        <TabsContent value="usage" className="mt-0 outline-none">
          <UsageTab />
        </TabsContent>

        <TabsContent value="invoices" className="mt-0 outline-none">
          <InvoicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}