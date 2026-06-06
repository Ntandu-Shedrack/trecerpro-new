"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface RegionData {
  name: string;
  count: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

const regions: RegionData[] = [
  {
    name: "North America",
    count: 6420,
    position: { top: "2.5rem", left: "2.5rem" },
  },
  { name: "APAC", count: 4120, position: { bottom: "2.5rem", right: "5rem" } },
  { name: "EMEA", count: 2300, position: { top: "5rem", right: "10rem" } },
];

const alerts = [
  {
    type: "Verification Lapse",
    priority: "Immediate",
    count: 4610,
    description: "Unverified assets found in recent scan.",
    color: "red",
  },
  {
    type: "Inventory Gaps",
    priority: "High Priority",
    count: 124,
    description: "Missing barcodes for new deliveries.",
    color: "amber",
  },
  {
    type: "Hardware Errors",
    priority: "Routine",
    count: 12,
    description: "Failed scans due to label damage.",
    color: "slate",
  },
];

const alertColorMap: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  red: {
    bg: "bg-destructive/10 hover:bg-destructive/15",
    border: "border-destructive/20",
    text: "text-destructive",
  },
  amber: {
    bg: "bg-amber-500/10 hover:bg-amber-500/15",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  slate: {
    bg: "bg-muted/60 hover:bg-muted/80",
    border: "border-border/60",
    text: "text-muted-foreground",
  },
};

export function DashboardOperations() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Regional Distribution */}
      <Card className="lg:col-span-2 relative overflow-hidden border-border bg-card/75 backdrop-blur-md shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
          <h4 className="font-bold text-foreground mb-4">
            Regional Distribution
          </h4>

          <div className="relative h-64 w-full bg-muted/20 rounded-lg flex items-center justify-center border border-border/40 overflow-hidden">
            {/* Abstract gradient overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>

            {/* Map Image */}
            <Image
              alt="Regional Map showing regional distribution of assets"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANiMUNZiPQL5JnFffZb4co41TVOvMYc0OvN4NzRRH-3NGGcVJxliMQ-FcgvV6f8oKglZUsfkDqvtnFQp2ohblyb2vvCeBuyTcsPGlaJ7IYLqo97X7XVoUUVQme3nHI9oGy4FKpbYVGwePbsNMdtEfrBncaEutU8OXzEye8GFano_acguUh8BLZMYLZ_yeiZeHUMkbNRhDNqEVyfzomFM2dQBwmQDBwVbZe77FaHUIB1as82ba-TYqWQ8Ouyxn_8dylBtojVUoGsug"
              width={500}
              height={400}
              className="z-10 opacity-30 dark:opacity-45 grayscale dark:invert"
              priority
            />

            {/* Region Overlay Chips */}
            {regions.map((region) => (
              <div
                key={region.name}
                className="absolute z-20 p-3 bg-card/85 backdrop-blur border border-border/80 rounded-lg shadow-md"
                style={region.position}
              >
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  {region.name}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {region.count.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card className="border-border bg-card/75 backdrop-blur-md shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500 w-5 h-5 animate-pulse" />
            <h4 className="font-bold text-foreground">
              Critical Alerts
            </h4>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => {
              const styles = alertColorMap[alert.color] ?? alertColorMap.slate;

              return (
                <div
                  key={alert.type}
                  className={`p-4 rounded-lg border transition-all duration-300 ${styles.bg} ${styles.border}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}
                    >
                      {alert.type}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {alert.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
