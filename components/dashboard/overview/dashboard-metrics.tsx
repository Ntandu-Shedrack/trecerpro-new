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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-8">
      {/* Total Assets */}

      <Card className="border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>

            <Badge
              variant="secondary"
              className="text-emerald-500 bg-emerald-500/10 flex items-center gap-1"
            >
              <TrendingUpIcon className="h-3 w-3" />
              4.2%
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Assets
          </p>

          <h3 className="text-2xl font-bold">12,840</h3>
        </CardContent>
      </Card>

      {/* Asset Categories */}

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>

            <Badge variant="secondary" className="text-muted-foreground">
              Static
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Asset Categories
          </p>

          <h3 className="text-2xl font-bold">24</h3>
        </CardContent>
      </Card>

      {/* Verified Assets */}

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <BadgeCheck className="h-5 w-5" />
            </div>

            <Badge variant="secondary" className="text-muted-foreground">
              64% Target
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Verified Assets
          </p>

          <h3 className="text-2xl font-bold">8,230</h3>
        </CardContent>
      </Card>

      {/* Monthly Growth */}

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>

            <Badge
              variant="secondary"
              className="text-emerald-500 bg-emerald-500/10 flex items-center gap-1"
            >
              <TrendingUpIcon className="h-3 w-3" />
              12%
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Monthly Growth
          </p>

          <h3 className="text-2xl font-bold">+12%</h3>
        </CardContent>
      </Card>
    </div>
  );
}
