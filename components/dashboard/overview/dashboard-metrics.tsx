"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  FolderKanban,
  Layers,
  TrendingUp,
  TrendingUpIcon,
  Users,
} from "lucide-react";
import { DashboardStats } from "@/types";

interface DashboardMetricsProps {
  stats: DashboardStats;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  badge?: React.ReactNode;
}

function MetricCard({ title, value, icon: Icon, iconBgClass, badge }: MetricCardProps) {
  return (
    <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`size-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBgClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          {badge}
        </div>

        <p className="text-xs font-medium text-muted-foreground">
          {title}
        </p>

        <h3 className="text-xl font-bold mt-0.5 text-foreground">
          {value}
        </h3>
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const isGrowthPositive = stats.monthlyGrowth >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-2 py-4 px-4 sm:px-6">
      <MetricCard
        title="Total Projects"
        value={stats.projectCount.toLocaleString()}
        icon={FolderKanban}
        iconBgClass="bg-primary/10 text-primary"
      />

      <MetricCard
        title="Total Categories"
        value={stats.categoryCount.toLocaleString()}
        icon={Layers}
        iconBgClass="bg-purple-500/10 text-purple-500"
      />

      <MetricCard
        title="Total Assets"
        value={stats.assetCount.toLocaleString()}
        icon={Package}
        iconBgClass="bg-emerald-500/10 text-emerald-500"
      />

      <MetricCard
        title="Monthly Growth"
        value={`${isGrowthPositive ? "+" : ""}${stats.monthlyGrowth}%`}
        icon={TrendingUp}
        iconBgClass="bg-orange-500/10 text-orange-500"
        badge={
          <Badge
            variant="secondary"
            className={`border-none text-[10px] px-1.5 py-0.5 flex items-center gap-1 ${isGrowthPositive
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
              : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
              }`}
          >
            <TrendingUpIcon className={`h-2.5 w-2.5 ${!isGrowthPositive ? "rotate-180" : ""}`} />
            {stats.monthlyGrowth}%
          </Badge>
        }
      />

      <MetricCard
        title="Team Members"
        value={stats.memberCount.toLocaleString()}
        icon={Users}
        iconBgClass="bg-sky-500/10 text-sky-500"
      />
    </div>
  );
}
