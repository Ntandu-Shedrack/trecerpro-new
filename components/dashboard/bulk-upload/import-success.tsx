"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Package,
  AlertCircle,
  Copy,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ImportSuccess() {
  const stats = {
    assetsCreated: 150,
    errors: 0,
    duplicates: 0,
    project: "HQ Campus",
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8 relative">
      {/* Background pattern */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#137fec 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <Card className="relative w-full max-w-4xl border-slate-800 bg-slate-900/60 backdrop-blur">
        <CardContent className="p-12 text-center space-y-10">
          {/* Success Icon */}

          <div className="flex justify-center">
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={48} />
            </div>
          </div>

          {/* Heading */}

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Import Successful!
            </h2>

            <p className="text-muted-foreground text-lg">
              Your asset data has been successfully imported into the{" "}
              <span className="font-semibold text-white">{stats.project}</span>{" "}
              project.
            </p>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Assets Created"
              value={stats.assetsCreated}
              icon={<Package size={18} />}
            />

            <StatCard
              label="Errors"
              value={stats.errors}
              icon={<AlertCircle size={18} />}
            />

            <StatCard
              label="Duplicates"
              value={stats.duplicates}
              icon={<Copy size={18} />}
            />
          </div>

          <Separator />

          {/* Actions */}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="flex items-center text-white gap-2">
              <Package size={16} />
              View Assets in Inventory
              <ArrowRight size={16} />
            </Button>

            <Button variant="secondary" className="flex items-center gap-2">
              <Plus size={16} />
              Upload Another File
            </Button>
          </div>

          {/* Back Link */}

          <div>
            <Link
              href="/dashboard/overview"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Button
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
        {icon}
        {label}
      </div>

      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
