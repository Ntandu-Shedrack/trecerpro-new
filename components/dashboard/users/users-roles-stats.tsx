"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Mail } from "lucide-react";

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
      {/* Total Users */}
      <Card className="bg-card border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total Users
            </span>

            <Users className="text-primary" size={20} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">1,284</span>

            <span className="text-xs font-semibold text-emerald-500">+12%</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Roles */}
      <Card className="bg-card border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Active Roles
            </span>

            <ShieldCheck className="text-primary" size={20} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">24</span>

            <span className="text-xs font-semibold text-muted-foreground">
              Stable
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card className="bg-card border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Pending Invites
            </span>

            <Mail className="text-primary" size={20} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">42</span>

            <span className="text-xs font-semibold text-amber-500">-3%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
