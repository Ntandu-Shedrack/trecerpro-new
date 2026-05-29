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
      <section className="w-full bg-white md:px-20 py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 mb-12"
          >
            <h2 className="text-3xl text-slate-900 font-bold tracking-tight">
              Core Enterprise Capabilities
            </h2>

            <p className="text-muted text-lg max-w-2xl">
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
                <motion.div key={index} variants={item} whileHover={{ y: -8 }}>
                  <Card className="group border border-slate-300 rounded-lg hover:shadow-xl bg-white hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-col space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        className="w-fit"
                      >
                        <Icon className="w-12 h-12 bg-primary/7 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors" />
                      </motion.div>

                      <div>
                        <div className="flex items-center text-slate-900 gap-2">
                          <CardTitle>{feature.title}</CardTitle>

                          {feature.badge && (
                            <Badge className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-muted">
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
      <section className="bg-white py-20 px-6 md:px-20 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border bg-background"
            >
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                <LayoutDashboard className="h-20 w-20 text-primary/20" />
              </div>

              <div className="absolute bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg border w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Live Sync Active
                  </span>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "66%" }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex flex-col gap-8"
          >
            <h2 className="text-3xl text-slate-900 font-bold leading-tight">
              Advanced Platform Reliability
            </h2>

            <div className="space-y-6">
              {advancedFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex gap-4"
                  >
                    <div className="text-primary mt-1">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 text-xl">
                        {feature.title}
                      </h4>

                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={item}>
              <Button variant="link" className="px-0 font-semibold">
                Explore all integrations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
