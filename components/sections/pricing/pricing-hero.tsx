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
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Flexible Plans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Choose the plan that&apos;s right for your organization&apos;s asset
            management needs.
          </motion.p>

          <BillingToggle billing={billing} setBilling={setBilling} />
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4">
      <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing === "monthly"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setBilling("annual")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing === "annual"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Annual
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full"
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border transition-all duration-300 ${
        plan.popular
          ? "border-primary/50 shadow-2xl shadow-primary/20 bg-gradient-to-br from-white to-primary/2 md:scale-105 z-20"
          : "border-slate-200 bg-white hover:shadow-lg hover:border-slate-300"
      }`}
    >
      {plan.popular && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white text-[11px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg"
        >
          Most Popular
        </motion.div>
      )}

      <div className="p-8 md:p-10 flex flex-col h-full">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-slate-900 mb-2">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-10 flex items-baseline gap-1">
          {price !== null ? (
            <>
              <span className="text-3xl font-black text-slate-900">$</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={price}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl font-black text-slate-900"
                >
                  {price}
                </motion.span>
              </AnimatePresence>
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm">/month</span>
                <span className="text-slate-400 text-xs">billed annually</span>
              </div>
            </>
          ) : (
            <span className="text-5xl font-black text-slate-900">Custom</span>
          )}
        </div>

        <button
          className={`w-full py-3.5 rounded-xl font-semibold mb-10 transition-all duration-200 transform hover:scale-105 ${
            plan.popular
              ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
              : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-transparent hover:border-slate-300"
          }`}
        >
          {plan.cta}
        </button>

        <ul className="space-y-4 flex-1">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-600"
            >
              <CheckCircle className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
