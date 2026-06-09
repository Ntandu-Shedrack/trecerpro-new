import { DashboardActivity } from "@/components/dashboard/overview/dashboard-activity";
import { DashboardInsights } from "@/components/dashboard/overview/dashboard-insights";
import { DashboardMetrics } from "@/components/dashboard/overview/dashboard-metrics";
import { DashboardOperations } from "@/components/dashboard/overview/dashboard-operations";
import { getDashboardSummary } from "@/actions/overview.actions";

export default async function DashboardOverviewPage() {
  const { data } = await getDashboardSummary("");
  const stats = data?.stats ?? {
    projectCount: 0,
    categoryCount: 0,
    assetCount: 0,
    monthlyGrowth: 0,
  };

  return (
    <div className="space-y-6">
      <DashboardMetrics stats={stats} />
      <DashboardInsights
        chartData={data?.chartData ?? []}
        categoryDistribution={data?.categoryDistribution ?? []}
        lifecycleDistribution={data?.lifecycleDistribution ?? []}
      />
      <DashboardActivity />
      <DashboardOperations />
    </div>
  );
}
