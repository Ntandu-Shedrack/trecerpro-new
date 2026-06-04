"use client";

import { useCurrentOrganization } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Zap, Loader2, CreditCard, CalendarDays, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  updateOrganizationPlan,
  getOrganizationBilling,
} from "@/actions/billing.actions";
import {
  PLANS,
  type PlanId,
  type BillingCycle,
  type OrgBillingData,
} from "@/lib/billing-configs";

export default function PlansTab() {
  const router = useRouter();
  const { organization, isLoaded } = useCurrentOrganization();
  const [billingData, setBillingData] = useState<OrgBillingData | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isFetchingBilling, setIsFetchingBilling] = useState(true);

  // Fetch real billing metadata once org is loaded
  useEffect(() => {
    if (!organization?.id) return;
    setIsFetchingBilling(true);
    getOrganizationBilling(organization.id)
      .then(({ data }) => {
        if (data) {
          setBillingData(data);
          setBillingCycle(data.billingCycle);
        }
      })
      .finally(() => setIsFetchingBilling(false));
  }, [organization?.id]);

  const isLoading = !isLoaded || !organization || isFetchingBilling;

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlanId: PlanId = billingData?.planId ?? "starter";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];

  const currentPrice =
    billingCycle === "monthly"
      ? currentPlan.monthlyPriceCents
      : currentPlan.annualPriceCents;

  const handlePlanSelect = async (planId: PlanId) => {
    if (planId === currentPlanId) return;

    setLoadingPlan(planId);
    try {
      const result = await updateOrganizationPlan(
        organization.id,
        planId,
        billingCycle
      );
      if (!result.success) throw new Error(result.error);

      router.refresh();

      // Optimistically update local state
      setBillingData((prev) => ({
        ...(prev ?? { billingCycle, planActivatedAt: null }),
        planId,
        planActivatedAt: new Date().toISOString(),
      }));

      const planName = PLANS.find((p) => p.id === planId)?.name ?? planId;
      toast.success(`Switched to ${planName} plan`);
    } catch (err: any) {
      console.error("handlePlanSelect error:", err);
      toast.error(err.message || "Failed to update plan");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      <Card className="overflow-hidden border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">
              Current Subscription
            </CardTitle>
            <CardDescription>
              You are currently on the{" "}
              <span className="font-semibold text-foreground">
                {currentPlan.name}
              </span>{" "}
              plan.
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            Active
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold">
              {currentPrice === 0
                ? "Free"
                : currentPrice !== null
                ? `$${(currentPrice / 100).toFixed(2)}`
                : "Custom"}
            </span>
            {currentPrice !== null && currentPrice > 0 && (
              <span className="text-muted-foreground text-sm">
                /{billingCycle === "monthly" ? "month" : "month, billed annually"}
              </span>
            )}
          </div>

          {billingData?.planActivatedAt && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>
                Active since{" "}
                {format(new Date(billingData.planActivatedAt), "MMMM d, yyyy")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Switcher */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Available Plans</h3>
            <p className="text-sm text-muted-foreground">
              Select the plan that best fits your needs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={billingCycle === "monthly" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annual" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setBillingCycle("annual")}
            >
              Annual
              <Badge className="ml-1 bg-green-500/10 text-green-600 hover:bg-green-500/10 border-none px-1 h-4">
                -20%
              </Badge>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const price =
              billingCycle === "monthly"
                ? plan.monthlyPriceCents
                : plan.annualPriceCents;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col transition-shadow ${
                  isCurrent ? "border-primary ring-1 ring-primary" : ""
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Current
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 h-8">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {price === 0
                        ? "Free"
                        : price !== null
                        ? `$${(price / 100).toFixed(0)}`
                        : "Custom"}
                    </span>
                    {price !== null && price > 0 && (
                      <span className="text-muted-foreground text-xs">/mo</span>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || loadingPlan !== null}
                    onClick={() => handlePlanSelect(plan.id as PlanId)}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales"
                    ) : (
                      "Switch Plan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment info notice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
          <CardDescription>
            Manage how you pay for your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Payment managed securely via Clerk Billing
              </p>
              <p className="text-xs text-muted-foreground">
                To update your payment method or download detailed receipts,
                please contact our support team or visit the billing portal.
              </p>
              <Button
                variant="link"
                className="px-0 h-auto text-xs text-primary"
                onClick={() =>
                  toast("Redirecting to billing portal…", { icon: "🔗" })
                }
              >
                Open Billing Portal →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
