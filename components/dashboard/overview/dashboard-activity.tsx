"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  AlertCircle,
  FilePlus,
  RefreshCcw,
  ArrowRight,
  Clock,
} from "lucide-react";

const recentScans = [
  {
    asset: "MacBook Pro M2",
    scannedBy: "Sarah Jenkins",
    time: "2 mins ago",
    status: "Verified",
  },
  {
    asset: 'Dell UltraSharp 27"',
    scannedBy: "Mike Chen",
    time: "14 mins ago",
    status: "Verified",
  },
  {
    asset: "Poly Studio X50",
    scannedBy: "Anna Smith",
    time: "1 hour ago",
    status: "Warning",
  },
  {
    asset: 'Dell UltraSharp 27"',
    scannedBy: "Mike Chen",
    time: "14 mins ago",
    status: "Verified",
  },
  {
    asset: "MacBook Pro M2",
    scannedBy: "Sarah Jenkins",
    time: "2 mins ago",
    status: "Verified",
  },
  {
    asset: "Poly Studio X50",
    scannedBy: "Anna Smith",
    time: "1 hour ago",
    status: "Warning",
  },
];

const activities = [
  {
    icon: FilePlus,
    color: "emerald",
    title: "New Batch Upload",
    description: "240 new servers added to the NYC-01 cluster.",
    time: "3 hours ago",
    pill: "System",
  },
  {
    icon: RefreshCcw,
    color: "orange",
    title: "Audit Completed",
    description: "EMEA quarterly asset verification finalized.",
    time: "5 hours ago",
    pill: "Compliance",
  },
  {
    icon: AlertCircle,
    color: "red",
    title: "Security Alert",
    description: "Unidentified Android attempting restricted scan.",
    time: "12 hours ago",
    pill: "Security",
  },
];

export function DashboardActivity() {
  const statusColors: Record<string, string> = {
    Verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    Warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    Pending: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-2 py-4 px-4 sm:px-6">
      {/* Recent Scans */}
      <Card className="border-border bg-card/75 backdrop-blur-md shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20 rounded-t-xl">
          <h4 className="font-bold text-foreground">
            Recent Barcode Scans
          </h4>
          <Link
            href="#"
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground font-medium text-xs border-b border-border bg-muted/30">
              <tr>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Scanned By</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentScans.map((scan, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-foreground truncate">
                    {scan.asset}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{scan.scannedBy}</td>
                  <td className="px-6 py-4 text-muted-foreground/80 text-xs">
                    {scan.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColors[scan.status]}`}
                    >
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="border-border bg-card/75 backdrop-blur-md shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-foreground">
            Activity Feed
          </h4>
          <Link
            href="#"
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative pl-10">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/60"></div>

          <div className="space-y-4">
            {activities.map((act, idx) => {
              const IconComponent = act.icon;

              // Map color tokens to safe Tailwind classes to avoid dynamic class pitfalls
              const colorMap: Record<
                string,
                { bg: string; text: string; ring: string }
              > = {
                emerald: {
                  bg: "bg-emerald-500/10",
                  text: "text-emerald-600 dark:text-emerald-400",
                  ring: "ring-emerald-500/20",
                },
                orange: {
                  bg: "bg-orange-500/10",
                  text: "text-orange-600 dark:text-orange-400",
                  ring: "ring-orange-500/20",
                },
                red: {
                  bg: "bg-red-500/10",
                  text: "text-red-600 dark:text-red-400",
                  ring: "ring-red-500/20",
                },
              };
              const colors = colorMap[act.color] ?? colorMap.emerald;

              return (
                <div key={idx} className="relative group">
                  {/* Icon */}
                  <div
                    className={`absolute -left-5 top-0 size-8 rounded-full flex items-center justify-center ${colors.bg} group-hover:scale-110 transition-transform shadow-md ring-1 ${colors.ring}`}
                  >
                    <IconComponent className={`${colors.text} w-4 h-4`} />
                  </div>

                  {/* Activity Card */}
                  <div className="w-full rounded-lg border border-border/50 bg-card/40 hover:bg-card/75 hover:border-border/80 transition-all duration-300">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-semibold text-sm">
                              {act.title}
                            </span>
                            {act.pill ? (
                              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                {act.pill}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {act.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5" /> {act.time}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border/40 bg-muted/10">
                      <button className="text-[11px] px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 border border-border transition-colors cursor-pointer">
                        Details
                      </button>
                      <button className="text-[11px] px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors cursor-pointer">
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
