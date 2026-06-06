"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Layers,
  BadgeCheck,
  TrendingUp,
  TrendingUpIcon,
} from "lucide-react";

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
      {/* Total Assets */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Package className="h-5 w-5" />
            </div>

            <Badge
              variant="secondary"
              className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-none flex items-center gap-1"
            >
              <TrendingUpIcon className="h-3 w-3" />
              4.2%
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Assets
          </p>

          <h3 className="text-2xl font-bold mt-1 text-foreground">12,840</h3>
        </CardContent>
      </Card>

      {/* Asset Categories */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Layers className="h-5 w-5" />
            </div>

            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
              Static
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Asset Categories
          </p>

          <h3 className="text-2xl font-bold mt-1 text-foreground">24</h3>
        </CardContent>
      </Card>

      {/* Verified Assets */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <BadgeCheck className="h-5 w-5" />
            </div>

            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
              64% Target
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Verified Assets
          </p>

          <h3 className="text-2xl font-bold mt-1 text-foreground">8,230</h3>
        </CardContent>
      </Card>

      {/* Monthly Growth */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-5 w-5" />
            </div>

            <Badge
              variant="secondary"
              className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-none flex items-center gap-1"
            >
              <TrendingUpIcon className="h-3 w-3" />
              12%
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Monthly Growth
          </p>

          <h3 className="text-2xl font-bold mt-1 text-foreground">+12%</h3>
        </CardContent>
      </Card>
    </div>
  );
}
