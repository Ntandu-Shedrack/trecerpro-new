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

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const isGrowthPositive = stats.monthlyGrowth >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 py-4 px-4 sm:px-6">
      {/* Total Projects */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Total Projects
          </p>

          <h3 className="text-xl font-bold mt-0.5 text-foreground">
            {stats.projectCount.toLocaleString()}
          </h3>
        </CardContent>
      </Card>

      {/* Total Categories */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Total Categories
          </p>

          <h3 className="text-xl font-bold mt-0.5 text-foreground">
            {stats.categoryCount.toLocaleString()}
          </h3>
        </CardContent>
      </Card>

      {/* Total Assets */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Package className="h-4 w-4" />
            </div>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Total Assets
          </p>

          <h3 className="text-xl font-bold mt-0.5 text-foreground">
            {stats.assetCount.toLocaleString()}
          </h3>
        </CardContent>
      </Card>

      {/* Monthly Growth */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="size-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-4 w-4" />
            </div>

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
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Monthly Growth
          </p>

          <h3 className="text-xl font-bold mt-0.5 text-foreground">
            {isGrowthPositive ? "+" : ""}{stats.monthlyGrowth}%
          </h3>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.12)]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="size-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Team Members
          </p>

          <h3 className="text-xl font-bold mt-0.5 text-foreground">
            {stats.memberCount.toLocaleString()}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
