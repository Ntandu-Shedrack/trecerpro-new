"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface DashboardInsightsProps {
  chartData: { name: string; total: number }[];
  categoryDistribution: { name: string; units: number; active?: number }[];
  lifecycleDistribution: { name: string; value: number }[];
}

export function DashboardInsights({
  categoryDistribution,
  lifecycleDistribution
}: DashboardInsightsProps) {
  // Standard color palette for category distribution area chart
  const primaryColor = "hsl(var(--primary))";

  // Map lifecycle statuses to harmonious semantic colors
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deploy") || s.includes("use") || s.includes("active")) return "#10B981"; // emerald-500
    if (s.includes("maintain") || s.includes("repair")) return "#F97316"; // orange-500
    if (s.includes("retired") || s.includes("dispose")) return "#64748B"; // slate-500
    return "#3B82F6"; // default blue-500 for In Stock
  };

  const lifecycle = lifecycleDistribution.map((item) => ({
    ...item,
    color: getStatusColor(item.name)
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-4">
      {/* Left: Asset Distribution (Area Chart matching requested styling) */}
      <Card className="border-border bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-foreground">
                Asset Distribution
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Category-wise breakdown of current inventory
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1 border-border/80 text-foreground"
            >
              Download <Download className="h-3 w-3" />
            </Button>
          </div>

          <div className="h-48 w-full">
            {categoryDistribution.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <TrendingUp className="h-8 w-8 text-muted-foreground mb-1 animate-pulse" />
                <p className="text-xs font-bold text-muted-foreground">No asset distribution data available.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="hsl(var(--muted-foreground))"
                    opacity={0.05}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--foreground))"
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: any, name: any) => {
                      const v = typeof value === "number" ? value : Number(value ?? 0);
                      const seriesName = name === "units" ? "Total Units" : "Active Units";
                      return [v.toLocaleString(), seriesName] as [string, string];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="units"
                    stroke={primaryColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUnits)"
                    dot={false}
                    activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2, fill: primaryColor }}
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                    dot={false}
                    activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2, fill: "#10B981" }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right: Asset Lifecycle (Pie Chart) */}
      <Card className="border-border bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-foreground">
                Asset Lifecycle
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dynamic asset condition status insights
              </p>
            </div>
            <select className="text-xs bg-muted border border-border rounded px-2 py-1 focus:ring-1 focus:ring-primary text-foreground">
              <option>All Assets</option>
            </select>
          </div>

          <div className="h-48 w-full">
            {lifecycle.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin mb-1" />
                <p className="text-xs font-bold text-muted-foreground">No asset lifecycle records found.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifecycle}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    stroke="var(--card)"
                    label={({ name, percent }) =>
                      `${name}: ${(((percent ?? 0) * 100) as number).toFixed(0)}%`
                    }
                  >
                    {lifecycle.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: any, name: any) => {
                      const v = typeof value === "number" ? value : Number(value ?? 0);
                      return [v.toLocaleString(), name ?? ""] as [string, string];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium justify-center text-foreground">
            {lifecycle.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.value.toLocaleString()} {item.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
