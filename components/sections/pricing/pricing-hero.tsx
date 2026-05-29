"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";
import { useState } from "react";

type Plan = {
  name: string;
  monthly: number | null;
  annual: number | null;
  description: string;
  cta: string;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 49,
    annual: 39,
    description: "Ideal for small teams getting started.",
    cta: "Start Free Trial",
    features: ["500 assets", "1 project", "Basic reporting", "Email support"],
  },
  {
    name: "Professional",
    monthly: 149,
    annual: 119,
    description: "For growing businesses needing scale.",
    cta: "Get Started",
    popular: true,
    features: [
      "5,000 assets",
      "10 projects",
      "Bulk upload",
      "Barcode generation",
      "5 users",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    description: "Full-scale operations and compliance.",
    cta: "Contact Sales",
    features: [
      "Unlimited assets",
      "Unlimited projects",
      "Advanced audit logs",
      "Dedicated support",
      "API Access",
    ],
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <section className="relative py-24 bg-dot-grid overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-aurora-1 -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] animate-aurora-2 -z-10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full mb-6 shadow-sm shadow-primary/5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Flexible Plans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6"
          >
            Simple, Transparent <span className="text-gradient">Pricing.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            Choose the plan that&apos;s right for your organization&apos;s asset
            management needs.
          </motion.p>

          <BillingToggle billing={billing} setBilling={setBilling} />
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6 items-stretch">
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                billing={billing}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BillingToggle({
  billing,
  setBilling,
}: {
  billing: "monthly" | "annual";
  setBilling: (v: "monthly" | "annual") => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2 bg-muted/65 p-1 rounded-full border border-border/40">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            billing === "monthly"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setBilling("annual")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            billing === "annual"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Annual
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider animate-pulse"
      >
        ✓ Save 20%
      </motion.div>
    </div>
  );
}

function PricingCard({
  plan,
  billing,
  index,
}: {
  plan: Plan;
  billing: "monthly" | "annual";
  index: number;
}) {
  const price =
    plan.monthly === null
      ? null
      : billing === "monthly"
        ? plan.monthly
        : plan.annual;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative rounded-[2rem] glass-card flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 ${
        plan.popular
          ? "border-primary/50 shadow-2xl shadow-primary/10 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-transparent md:scale-105 z-20"
          : "border-border/40 hover:border-primary/20 hover:shadow-md"
      }`}
    >
      {plan.popular && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          Most Popular
        </motion.div>
      )}

      <div className="p-8 md:p-10 flex flex-col h-full justify-between gap-8">
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-black text-foreground mb-1">
              {plan.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              {plan.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-8 flex items-baseline gap-1">
            {price !== null ? (
              <>
                <span className="text-2xl font-black text-foreground">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-5xl font-black text-foreground tracking-tight"
                  >
                    {price}
                  </motion.span>
                </AnimatePresence>
                <div className="flex flex-col ml-1">
                  <span className="text-muted-foreground text-[10px] font-bold">/month</span>
                  <span className="text-muted-foreground/60 text-[9px] font-medium">billed annually</span>
                </div>
              </>
            ) : (
              <span className="text-4xl font-black text-foreground tracking-tight">Custom</span>
            )}
          </div>

          <Button
            asChild
            className={`w-full py-6 rounded-full font-bold active:scale-[0.98] transition-transform ${
              plan.popular
                ? "bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted border border-border/80 hover:bg-muted/80 text-foreground"
            }`}
          >
            <button>{plan.cta}</button>
          </Button>
        </div>

        <ul className="space-y-4">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-xs text-muted-foreground font-semibold"
            >
              <div className="bg-primary/10 border border-primary/20 text-primary p-0.5 rounded-full flex-shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
