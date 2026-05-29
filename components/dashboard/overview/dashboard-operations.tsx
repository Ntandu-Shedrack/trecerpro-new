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

export function DashboardOperations() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
      {/* Regional Distribution */}
      <Card className="lg:col-span-2 relative overflow-hidden border-border shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">
            Regional Distribution
          </h4>

          <div className="relative h-64 w-full bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-border/50 overflow-hidden">
            {/* Abstract gradient overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>

            {/* Map Image */}
            <Image
              alt="Regional Map showing regional distribution of assets"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANiMUNZiPQL5JnFffZb4co41TVOvMYc0OvN4NzRRH-3NGGcVJxliMQ-FcgvV6f8oKglZUsfkDqvtnFQp2ohblyb2vvCeBuyTcsPGlaJ7IYLqo97X7XVoUUVQme3nHI9oGy4FKpbYVGwePbsNMdtEfrBncaEutU8OXzEye8GFano_acguUh8BLZMYLZ_yeiZeHUMkbNRhDNqEVyfzomFM2dQBwmQDBwVbZe77FaHUIB1as82ba-TYqWQ8Ouyxn_8dylBtojVUoGsug"
              width={500} // or your desired dimensions
              height={400}
              className="z-10 opacity-40 grayscale"
              priority // loads it eagerly for better LCP
            />

            {/* Region Overlay Chips */}
            {regions.map((region) => (
              <div
                key={region.name}
                className={`absolute p-3 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-border`}
                style={region.position}
              >
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {region.name}
                </p>
                <p className="text-lg font-bold text-slate-100">
                  {region.count}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500 w-5 h-5" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Critical Alerts
            </h4>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.type}
                className={`p-4 rounded-lg bg-${alert.color}-500/5 border border-${alert.color}-500/20 hover:bg-${alert.color}-500/10 transition-colors`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider text-${alert.color}-500`}
                  >
                    {alert.type}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {alert.priority}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-100">
                  {alert.count}
                </p>
                <p className="text-xs text-slate-400">{alert.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
