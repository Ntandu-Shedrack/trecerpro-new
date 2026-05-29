"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CheckCircle, Package, MapPin, Layers, Info } from "lucide-react";
import BulkUploadProgress from "./bulk-upload-progress";

export default function ReviewStep({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const summary = {
    totalAssets: 150,
    project: "HQ Campus",
    categories: "ICT Hardware, Furniture",
  };

  const importDetails = {
    fileName: "asset_inventory_q3_final.csv",
    environment: "Production Repository",
    duplicateStrategy: "Skip Existing",
    estimatedTime: "~ 45 seconds",
    readiness: 100,
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Review & Confirmation
            </h1>
            <p className="text-muted-foreground">
              Please review the import summary before finalizing your bulk
              upload.
            </p>
          </div>
          <Badge
            className="hidden sm:inline-flex bg-emerald-500 text-white"
            variant="secondary"
          >
            VALIDATED
          </Badge>
        </div>
      </div>

      <BulkUploadProgress step={4} />

      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Assets"
          value={summary.totalAssets.toString()}
          icon={<Package className="text-primary" />}
        />

        <SummaryCard
          title="Project"
          value={summary.project}
          icon={<MapPin className="text-primary" />}
        />

        <SummaryCard
          title="Categories"
          value={summary.categories}
          icon={<Layers className="text-primary" />}
        />
      </div>

      {/* Import Details */}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Import Details</CardTitle>
            <CardDescription>
              Final configuration before starting the import.
            </CardDescription>
          </div>

          <Badge
            className="sm:hidden inline-flex bg-emerald-500 text-white"
            aria-label="Validation status"
          >
            VALIDATED
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <DetailRow label="File Name" value={importDetails.fileName} />

          <Separator />

          <DetailRow
            label="Target Environment"
            value={importDetails.environment}
          />

          <Separator />

          <DetailRow
            label="Duplicate Strategy"
            value={importDetails.duplicateStrategy}
          />

          <Separator />

          <div className="space-y-2">
            <DetailRow
              label="Estimated Time"
              value={importDetails.estimatedTime}
            />
            <div className="flex items-center gap-3">
              <Progress value={importDetails.readiness} className="h-2" />
              <span className="text-xs text-muted-foreground">Ready</span>
            </div>
          </div>

          {/* Actions */}

          <div className="flex flex-col justify-between sm:flex-row gap-3 pt-6">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="text-white"
                    aria-label="Confirm and start import"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm & Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Start importing all validated assets
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              className="font-semibold"
              onClick={prev}
              aria-label="Cancel and go back"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}

      <Alert className="border-primary/30 bg-primary/10">
        <Info className="h-4 w-4 text-primary" />

        <AlertTitle className="text-primary">
          Pre-import check complete
        </AlertTitle>

        <AlertDescription>
          All data fields matched our schema requirements. No errors were
          detected in the 150 rows provided.
        </AlertDescription>
      </Alert>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-800 bg-card hover:bg-slate-800/50 hover:border-primary/40 transition-all group">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
            {title}
          </p>

          <p className="text-2xl font-bold">{value}</p>
        </div>

        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>

      <span className="font-medium truncate max-w-[60%] text-right">
        {value}
      </span>
    </div>
  );
}
