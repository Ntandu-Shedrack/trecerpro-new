export type PlanId = "starter" | "professional" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthlyPriceCents: number | null;
  annualPriceCents: number | null; // per-month cost when billed annually
  description: string;
  features: string[];
  limits: {
    assets: number | null;
    projects: number | null;
    members: number | null;
  };
}

export const PLANS: PlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    description: "Perfect for small teams and individuals.",
    features: ["500 assets", "1 project", "Basic reporting", "Email support"],
    limits: { assets: 500, projects: 1, members: 5 },
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPriceCents: 14900,
    annualPriceCents: 11900,
    description: "For growing businesses needing scale.",
    features: [
      "5,000 assets",
      "10 projects",
      "Bulk upload",
      "Barcode generation",
      "5 users",
    ],
    limits: { assets: 5000, projects: 10, members: 5 },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPriceCents: null,
    annualPriceCents: null,
    description: "Full-scale operations and compliance.",
    features: [
      "Unlimited assets",
      "Unlimited projects",
      "Advanced audit logs",
      "Dedicated support",
      "API Access",
    ],
    limits: { assets: null, projects: null, members: null },
  },
];

export interface OrgBillingData {
  planId: PlanId;
  billingCycle: BillingCycle;
  planActivatedAt: string | null;
}

export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  plan_id: string;
  billing_cycle: BillingCycle;
  amount_cents: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "void";
  description: string | null;
  created_at: string;
}

export interface OrgUsage {
  assets: { current: number; limit: number | null };
  projects: { current: number; limit: number | null };
  members: { current: number; limit: number | null };
}
