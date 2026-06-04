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
    <section className="bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight md:text-4xl">
            How TracerPro Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Four simple steps to total organizational control.
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
          {/* Desktop Connecting Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-12 bg-border origin-left lg:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="relative z-10 rounded-2xl border bg-primary/4 shadow-sm hover:border-primary/50 hover:shadow-xl transition-all">
                  <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>

                    <div>
                      <h3 className="mb-2 text-xl text-foreground font-bold">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
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
