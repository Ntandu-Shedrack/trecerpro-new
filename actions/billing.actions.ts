"use server";

import { revalidatePath } from "next/cache";

import {
  type PlanId,
  type BillingCycle,
  type PlanDefinition,
  PLANS,
  type OrgBillingData,
  type Invoice,
  type OrgUsage,
} from "@/lib/billing-configs";
import api from "@/lib/api";

// Mocking storage for billing updates since Laravel API does not have billing endpoints
let mockBillingStorage: Record<string, OrgBillingData> = {};
let mockInvoicesStorage: Record<string, Invoice[]> = {};

/**
 * Reads the current billing metadata for an organization.
 */
export async function getOrganizationBilling(
  organizationId: string
): Promise<{ data: OrgBillingData | null; error: string | null }> {
  try {
    const data = mockBillingStorage[organizationId] || {
      planId: "starter",
      billingCycle: "annual",
      planActivatedAt: new Date().toISOString(),
    };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

/**
 * Updates the organization's plan and records an invoice.
 */
export async function updateOrganizationPlan(
  organizationId: string,
  planId: PlanId,
  billingCycle: BillingCycle
): Promise<{ success: boolean; error?: string }> {
  try {
    mockBillingStorage[organizationId] = {
      planId,
      billingCycle,
      planActivatedAt: new Date().toISOString(),
    };

    const plan = PLANS.find((p) => p.id === planId);
    const price = billingCycle === "annual" ? (plan?.annualPriceCents || 0) : (plan?.monthlyPriceCents || 0);

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      organization_id: organizationId,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      plan_id: planId,
      billing_cycle: billingCycle,
      amount_cents: price,
      currency: "usd",
      status: "paid",
      description: `${plan?.name || planId} Plan - ${billingCycle}`,
      created_at: new Date().toISOString(),
    };

    if (!mockInvoicesStorage[organizationId]) {
      mockInvoicesStorage[organizationId] = [];
    }
    mockInvoicesStorage[organizationId].unshift(newInvoice);

    revalidatePath("/dashboard/settings/billing", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches all invoices for an organization.
 */
export async function getInvoices(
  organizationId: string
): Promise<{ data: Invoice[]; error: string | null }> {
  try {
    const data = mockInvoicesStorage[organizationId] || [];
    return { data, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
}

/**
 * Returns real asset / project / member usage counts for an organization from Laravel API.
 */
export async function getOrganizationUsage(
  organizationId: string,
  planId: PlanId = "starter"
): Promise<{ data: OrgUsage | null; error: string | null }> {
  try {
    const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

    // Fetch projects count and user count from Laravel Dashboard API
    const response = await api.get("/api/dashboard");
    const { stats, members } = response.data;

    return {
      data: {
        assets: { current: stats?.assetCount || 0, limit: plan.limits.assets },
        projects: { current: stats?.projectCount || 0, limit: plan.limits.projects },
        members: { current: members?.length || 0, limit: plan.limits.members },
      },
      error: null,
    };
  } catch (error: any) {
    console.error("getOrganizationUsage error:", error);
    const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
    return {
      data: {
        assets: { current: 0, limit: plan.limits.assets },
        projects: { current: 0, limit: plan.limits.projects },
        members: { current: 0, limit: plan.limits.members },
      },
      error: error.response?.data?.message || error.message,
    };
  }
}
