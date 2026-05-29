"use client";

import { motion, easeOut } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Boxes,
  Upload,
  Barcode,
  History,
  LayoutDashboard,
  RefreshCcw,
  Shield,
  Braces,
  ArrowRight,
} from "lucide-react";

import { CTASection } from "../cta-section";

const coreFeatures = [
  {
    title: "Asset Management",
    description:
      "Full lifecycle tracking from procurement to retirement with real-time updates and maintenance scheduling.",
    icon: Boxes,
  },
  {
    title: "Bulk Upload",
    description:
      "Seamlessly import thousands of records. Support for complex legacy data formats ensures rapid onboarding.",
    icon: Upload,
    badge: "CSV / Excel",
  },
  {
    title: "Barcode Assignment",
    description:
      "Generate and print unique asset identifiers. Compatible with standard label printers and mobile scanning devices.",
    icon: Barcode,
  },
  {
    title: "Verification History",
    description:
      "Maintain a complete immutable audit trail for compliance. Track who, when, and where for every single interaction.",
    icon: History,
  },
];

const advancedFeatures = [
  {
    title: "Real-time Cloud Sync",
    description:
      "Every scan is instantly synced across your entire organization.",
    icon: RefreshCcw,
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "256-bit AES encryption and RBAC ensure secure access control.",
    icon: Shield,
  },
  {
    title: "Scalable GraphQL API",
    description:
      "Connect ERP, CRM, and internal systems through a developer-first API.",
    icon: Braces,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function ProductFeatures() {
  return (
    <>
      {/* ================= CORE FEATURES ================= */}
      <section className="w-full bg-dot-grid py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[90px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Core Enterprise <span className="text-gradient">Capabilities</span>
            </h2>

            <p className="text-muted-foreground text-sm md:text-base max-w-2xl font-semibold">
              Everything you need to manage your asset lifecycle with
              confidence, transparency, and speed.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div key={index} variants={item}>
                  <Card className="glass-card glass-card-hover rounded-3xl border border-border/40 h-full">
                    <CardHeader className="flex flex-col space-y-4 p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        {feature.badge && (
                          <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider">
                            {feature.badge}
                          </span>
                        )}
                      </div>

                      <CardTitle className="text-lg font-bold text-foreground mt-2">{feature.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                      <CardDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= RELIABILITY SECTION ================= */}
      <section className="py-20 px-4 md:px-6 relative overflow-hidden bg-dot-grid border-t border-border/20">
        <div className="absolute bottom-10 left-10 w-90 h-90 bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-3xl opacity-50 pointer-events-none" />

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-border/40 glass-card bg-zinc-950/15 p-6 md:p-8 space-y-6">
              {/* Fake Terminal Header */}
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Sync Queue</span>
                </div>
                <span className="text-[10px] text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  Listening
                </span>
              </div>

              {/* Fake Scan Logs */}
              <div className="space-y-3 font-mono text-[10px] leading-relaxed text-zinc-400">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-green-400">✓ Scan #290: Category &apos;IT Gear&apos; updated</span>
                  <span className="text-zinc-500">1.2s ago</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-green-400">✓ Scan #291: GPS Telemetry coordinates assigned</span>
                  <span className="text-zinc-500">0.4s ago</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-green-400">✓ Scan #292: Forklift telemetry verified</span>
                  <span className="text-primary font-bold">Instant</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  <span className="text-xs font-bold text-white">Database Sync Load</span>
                </div>
                <div className="h-2 w-28 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "72%" }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex flex-col gap-8"
          >
            <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
              Advanced Platform <span className="text-gradient">Reliability</span>
            </h2>

            <div className="space-y-8">
              {advancedFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex gap-4 items-start"
                  >
                    <div className="text-primary bg-primary/10 border border-primary/20 p-2.5 rounded-xl flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-lg">
                        {feature.title}
                      </h4>

                      <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={item}>
              <Button asChild variant="link" className="px-0 font-bold text-sm text-primary hover:text-primary/80 group">
                <a href="/pricing" className="flex items-center gap-1">
                  Explore Enterprise SLA Rates
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
