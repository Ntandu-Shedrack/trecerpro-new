import { DashboardActivity } from "@/components/dashboard/overview/dashboard-activity";
import { DashboardInsights } from "@/components/dashboard/overview/dashboard-insights";
import { DashboardMetrics } from "@/components/dashboard/overview/dashboard-metrics";
import { DashboardOperations } from "@/components/dashboard/overview/dashboard-operations";

export default function DashboardOverviewPage() {
  return (
    <>
      <DashboardMetrics />
      <DashboardInsights />
      <DashboardActivity />
      <DashboardOperations />
    </>
  );
}
