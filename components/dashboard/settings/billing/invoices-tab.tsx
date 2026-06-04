"use client";

import { useOrganization } from "@/context/auth-context";
import { useState, useEffect } from "react";
import {
  Loader2,
  Download,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getInvoices } from "@/actions/billing.actions";
import { type Invoice, PLANS } from "@/lib/billing-configs";

// ─── Status badge config ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Invoice["status"],
  { label: string; className: string; icon: React.ElementType }
> = {
  paid: {
    label: "Paid",
    className: "bg-green-500/10 text-green-600 hover:bg-green-500/10",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600 hover:bg-red-500/10",
    icon: XCircle,
  },
  void: {
    label: "Void",
    className: "bg-muted text-muted-foreground hover:bg-muted",
    icon: Ban,
  },
};

function formatAmount(cents: number, currency: string): string {
  if (cents === 0) return "Free";
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function getPlanName(planId: string): string {
  return PLANS.find((p) => p.id === planId)?.name ?? planId;
}

// ─── Empty state ───────────────────────────────────────────────────────────

function EmptyInvoices() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <Receipt className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">No invoices yet</p>
        <p className="text-xs text-muted-foreground max-w-[260px]">
          Invoices will appear here after you subscribe to or switch between
          plans.
        </p>
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function InvoicesTab() {
  const { organization, isLoaded } = useOrganization();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!organization?.id) return;
    setIsFetching(true);
    getInvoices(organization.id)
      .then(({ data }) => setInvoices(data))
      .finally(() => setIsFetching(false));
  }, [organization?.id]);

  const isLoading = !isLoaded || !organization || isFetching;

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Billing History</h3>
          <p className="text-sm text-muted-foreground">
            View all invoices for{" "}
            <span className="font-medium text-foreground">
              {organization.name}
            </span>
            .
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Invoices table */}
      <Card>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <EmptyInvoices />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const statusCfg = STATUS_CONFIG[invoice.status];
                  const StatusIcon = statusCfg.icon;

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(invoice.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {getPlanName(invoice.plan_id)}
                      </TableCell>
                      <TableCell className="text-xs capitalize text-muted-foreground">
                        {invoice.billing_cycle}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {formatAmount(invoice.amount_cents, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusCfg.className} text-[10px] px-1.5 h-5 border-none gap-1`}
                        >
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Download invoice"
                          onClick={() => {
                            // In production, this would download a PDF receipt
                            const content = [
                              `Invoice: ${invoice.invoice_number}`,
                              `Date: ${format(new Date(invoice.created_at), "MMM d, yyyy")}`,
                              `Plan: ${getPlanName(invoice.plan_id)} (${invoice.billing_cycle})`,
                              `Amount: ${formatAmount(invoice.amount_cents, invoice.currency)}`,
                              `Status: ${invoice.status}`,
                              invoice.description
                                ? `Description: ${invoice.description}`
                                : "",
                            ]
                              .filter(Boolean)
                              .join("\n");

                            const blob = new Blob([content], {
                              type: "text/plain",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${invoice.invoice_number}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Custom invoice notice */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Need a custom invoice?</h4>
            <p className="text-xs text-muted-foreground">
              If you require a custom invoice with specific tax information or
              business details, please contact our support team.
            </p>
            <Button
              variant="link"
              className="px-0 h-auto text-xs text-primary decoration-primary/30 hover:decoration-primary"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
