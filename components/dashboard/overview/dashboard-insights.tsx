"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function DashboardInsights() {
  const distribution = [
    { name: "Laptops", units: 4210, color: "#6366F1" }, // primary
    { name: "Monitors", units: 3850, color: "#60A5FA" }, // blue-400
    { name: "Furniture", units: 2100, color: "#818CF8" }, // indigo-400
    { name: "Servers", units: 1240, color: "#A78BFA" }, // violet-400
  ];

  const lifecycle = [
    { name: "Active", value: 9023, color: "#10B981" }, // emerald-500
    { name: "Repairing", value: 1210, color: "#F97316" }, // orange-500
    { name: "Retired", value: 2607, color: "#6B7280" }, // slate-500
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 p-8">
      {/* Left: Asset Distribution */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Asset Distribution
            </h4>
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              Download <Download className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400 uppercase">{item.name}</span>
                  <span className="text-slate-100">
                    {item.units.toLocaleString()} units
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.units / distribution.reduce((acc, i) => acc + i.units, 0)) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right: Asset Lifecycle (Pie Chart) */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Asset Lifecycle
            </h4>
            <select className="text-xs bg-slate-800 border-none rounded focus:ring-1 focus:ring-primary text-slate-400">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="h-48 w-full">
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
                  label={({ name, percent }) =>
                    `${name}: ${(((percent ?? 0) * 100) as number).toFixed(0)}%`
                  }
                >
                  {lifecycle.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value?: number | string, name?: string) => {
                    const v =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [v.toLocaleString(), name ?? ""] as [string, string];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-6 flex gap-6 text-xs font-medium justify-center">
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
