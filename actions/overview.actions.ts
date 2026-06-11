"use server";

import api from "@/lib/api";
import type { Activity, DashboardSummary } from "@/types";

export async function getDashboardSummary(
  _organizationId: string,
  activityLimit: number = 10
) {
  try {
    const response = await api.get("/api/dashboard");
    const data = response.data;
    const rawChart = data.chartData ?? [];
    const chartData = rawChart.map(
      (item: { name?: string; month?: string; total?: number; count?: number }) => ({
        name: item.name ?? item.month ?? "",
        total: item.total ?? item.count ?? 0,
      })
    );
    const summary: DashboardSummary = {
      stats: data.stats ?? {
        projectCount: 0,
        categoryCount: 0,
        assetCount: 0,
        memberCount: 0,
        monthlyGrowth: 0,
      },
      chartData,
      categoryDistribution: data.categoryDistribution ?? [],
      lifecycleDistribution: data.lifecycleDistribution ?? [],
      activities: (data.activities ?? []).slice(0, activityLimit) as Activity[],
      members: data.members ?? [],
    };
    return { data: summary, error: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error("Error fetching dashboard from Laravel API:", error);
    return {
      data: {
        stats: { projectCount: 0, categoryCount: 0, assetCount: 0, memberCount: 0, monthlyGrowth: 0 },
        chartData: [],
        activities: [],
        members: [],
      } as DashboardSummary,
      error: err.response?.data?.message || err.message,
    };
  }
}

/** @deprecated Use getDashboardSummary */
export async function getOrganizationStats(organizationId: string) {
  const { data, error } = await getDashboardSummary(organizationId);
  return { data: data.stats, error };
}

/** @deprecated Use getDashboardSummary */
export async function getOrganizationAssetChartData(organizationId: string) {
  const { data, error } = await getDashboardSummary(organizationId);
  return { data: data.chartData, error };
}

/** @deprecated Use getDashboardSummary */
export async function getOrganizationActivities(
  organizationId: string,
  limit: number = 10
) {
  const { data, error } = await getDashboardSummary(organizationId, limit);
  return { data: data.activities, error };
}

export async function getDashboardMembers(_organizationId: string) {
  const { data, error } = await getDashboardSummary(_organizationId);
  return { data: data.members, error };
}
