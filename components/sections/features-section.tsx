"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  BarChart3,
  TrendingDown,
  Cloud,
  Shield,
} from "lucide-react";

const highlights = [
  "SOC2 Type II Compliant",
  "24/7 Global Support",
  "Infinite Custom Fields",
];

const features = [
  {
    title: "99.9% Data Accuracy",
    description:
      "Eliminate human error with automated barcode scanning and real-time checksum validation.",
    icon: BarChart3,
  },
  {
    title: "Reduce Asset Loss",
    description:
      "Advanced geofencing and movement logs prevent asset misplacement and unauthorized usage.",
    icon: TrendingDown,
  },
  {
    title: "Cloud-Sync Tech",
    description:
      "Access your inventory globally with instant synchronization across mobile and web platforms.",
    icon: Cloud,
  },
  {
    title: "Enterprise Security",
    description:
      "Role-based access controls and detailed audit trails for every single interaction.",
    icon: Shield,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-dot-grid">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-16 lg:flex-row items-start">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-28"
          >
            <h2 className="text-3xl md:text-5xl font-black text-foreground leading-[1.15] tracking-tight">
              Engineered for <span className="text-gradient">Efficiency.</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
              TracerPro was built by logistics experts for complex enterprise
              environments. We focus on the data details so you can run the
              business smoothly.
            </p>

            <Separator className="bg-border/60" />

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-muted-foreground text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT BENTO GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Bento Card 1 - WIDE FEATURE (Simulated Graph) */}
            <motion.div
              variants={item}
              className="sm:col-span-2"
            >
              <Card className="glass-card glass-card-hover rounded-3xl border border-border/40 overflow-hidden bg-gradient-to-br from-primary/10 via-indigo-500/5 to-transparent">
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="space-y-4 md:w-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl text-foreground font-black tracking-tight">
                      99.98% Real-Time Tracking Uptime
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                      Eliminate equipment errors with automated barcode checksum validation, live mapping, and instant status synchronizations.
                    </p>
                  </div>

                  {/* Simulated telemetry bar chart */}
                  <div className="w-full md:w-1/2 bg-white/5 rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      <span>Live Traffic Load</span>
                      <span className="text-green-400">Excellent</span>
                    </div>
                    <div className="flex items-end justify-between h-20 px-2 gap-2">
                      {[30, 45, 35, 60, 85, 40, 75, 90, 55, 65].map((val, i) => (
                        <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all relative group" style={{ height: `${val}%` }}>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-zinc-950 text-white text-[8px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {val}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
                      <span>00:00</span>
                      <span>12:00</span>
                      <span>24:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Standard Bento Cards */}
            {features.slice(1).map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  variants={item}
                >
                  <Card className="glass-card glass-card-hover rounded-3xl border border-border/40 h-full">
                    <CardContent className="p-8 flex flex-col justify-between h-full min-h-[220px]">
                      <div className="space-y-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="text-base text-foreground font-bold">
                          {feature.title}
                        </h3>

                        <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
