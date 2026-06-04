"use client";

import { useOrganization } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Database, FolderKanban, Users, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getOrganizationUsage,
  getOrganizationBilling,
} from "@/actions/billing.actions";
import {
  type OrgUsage,
  type PlanId,
  PLANS,
} from "@/lib/billing-configs";

interface UsageItem {
  name: string;
  description: string;
  current: number;
  limit: number | null;
  icon: React.ElementType;
}

export default function UsageTab() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();
  const [usage, setUsage] = useState<OrgUsage | null>(null);
  const [planId, setPlanId] = useState<PlanId>("starter");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organization?.id) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch billing metadata first to know the plan
        const { data: billing } = await getOrganizationBilling(organization!.id);
        const resolvedPlanId: PlanId = billing?.planId ?? "starter";
        setPlanId(resolvedPlanId);

        // Then fetch real usage with plan context
        const { data: usageData } = await getOrganizationUsage(
          organization!.id,
          resolvedPlanId
        );
        if (usageData) setUsage(usageData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organization?.id]);

  if (!isLoaded || !organization || isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  const usageItems: UsageItem[] = usage
    ? [
        {
          name: "Assets",
          description: "Total assets tracked across all projects",
          current: usage.assets.current,
          limit: usage.assets.limit,
          icon: Database,
        },
        {
          name: "Projects",
          description: "Active projects in this workspace",
          current: usage.projects.current,
          limit: usage.projects.limit,
          icon: FolderKanban,
        },
        {
          name: "Team Members",
          description: "Users with access to this organization",
          current: usage.members.current,
          limit: usage.members.limit,
          icon: Users,
        },
      ]
    : [];

  const hasAnyLimit = usageItems.some(
    (item) => item.limit !== null && item.current >= item.limit
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Usage &amp; Limits</h3>
          <p className="text-sm text-muted-foreground">
            Monitor your organization&apos;s resource consumption against your{" "}
            <span className="font-medium text-foreground">{currentPlan.name}</span>{" "}
            plan limits.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/20 capitalize"
        >
          {currentPlan.name}
        </Badge>
      </div>

      <div className="grid gap-4">
        {usageItems.map((item) => {
          const isUnlimited = item.limit === null;
          const percentage = isUnlimited
            ? 0
            : Math.min((item.current / item.limit!) * 100, 100);
          const isAtLimit = !isUnlimited && item.current >= item.limit!;
          const isNearLimit =
            !isUnlimited && !isAtLimit && percentage >= 80;

          return (
            <Card key={item.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">
                      {item.name}
                    </CardTitle>
                    {isNearLimit && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {item.description}
                  </CardDescription>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-semibold">
                    {item.current}
                    {!isUnlimited && (
                      <span className="text-muted-foreground font-normal">
                        {" "}/ {item.limit}
                      </span>
                    )}
                    {isUnlimited && (
                      <span className="text-muted-foreground font-normal text-xs ml-1">
                        / ∞
                      </span>
                    )}
                  </div>
                  {isAtLimit && (
                    <div className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                      Limit Reached
                    </div>
                  )}
                  {isNearLimit && (
                    <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                      Near Limit
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isUnlimited ? (
                  <>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        isAtLimit
                          ? "[&>div]:bg-destructive"
                          : isNearLimit
                          ? "[&>div]:bg-amber-500"
                          : ""
                      }`}
                    />
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {isAtLimit
                        ? `You've reached your ${item.name.toLowerCase()} limit. Upgrade to increase it.`
                        : isNearLimit
                        ? `You're approaching your limit — ${item.limit! - item.current} ${item.name.toLowerCase()} remaining.`
                        : `${item.limit! - item.current} ${item.name.toLowerCase()} remaining on the ${currentPlan.name} plan.`}
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Unlimited {item.name.toLowerCase()} on the{" "}
                    {currentPlan.name} plan.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upgrade CTA — only show when not on enterprise */}
      {planId !== "enterprise" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">
                    {hasAnyLimit ? "You've hit a limit!" : "Need more capacity?"}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasAnyLimit
                    ? "Upgrade your plan to unlock more assets, projects, and team members."
                    : "Upgrade to a higher plan to unlock more assets, projects, and advanced features."}
                </p>
              </div>
              <Button
                size="sm"
                className="whitespace-nowrap text-xs"
                onClick={() => router.push("/dashboard/settings/billing")}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
