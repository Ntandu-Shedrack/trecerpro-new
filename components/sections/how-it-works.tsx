"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Network, LayoutList, Upload, BadgeCheck } from "lucide-react";
import { motion, easeOut } from "framer-motion";

const steps = [
  {
    title: "Setup Project",
    description:
      "Map out your locations, departments, and user permissions in minutes.",
    icon: Network,
  },
  {
    title: "Define Categories",
    description:
      "Create custom metadata fields for IT, furniture, or fleet assets.",
    icon: LayoutList,
  },
  {
    title: "Upload Assets",
    description:
      "Bulk import via CSV or scan tags directly with our mobile app.",
    icon: Upload,
  },
  {
    title: "Verify & Track",
    description:
      "Execute live audits and get real-time location updates instantly.",
    icon: BadgeCheck,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-dot-grid">
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 space-y-4 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            How TracerPro Works
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground font-medium">
            Four simple steps to total organizational control over your inventory.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                variants={item}
                className="relative"
              >
                <Card className="glass-card glass-card-hover relative z-10 rounded-3xl shadow-sm border border-border/40 overflow-hidden">
                  {/* Step Indicator Badge */}
                  <div className="absolute top-4 right-6 text-2xl font-black text-muted-foreground/15 select-none">
                    0{index + 1}
                  </div>

                  <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm shadow-primary/5">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg text-foreground font-bold">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
