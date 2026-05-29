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
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-16 lg:flex-row">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            <h2 className="text-4xl text-slate-900 md:text-5xl font-extrabold leading-tight tracking-tight">
              Engineered for Efficiency.
            </h2>

            <p className="text-lg text-muted leading-relaxed">
              TracerPro was built by logistics experts for complex enterprise
              environments. We focus on the data so you can focus on the
              business.
            </p>

            <Separator />

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-semibold text-muted/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Card className="group rounded-2xl border bg-primary/4 hover:border-primary/50 hover:shadow-xl transition-all">
                    <CardContent className="p-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>

                      <h3 className="mb-3 text-xl text-slate-800 font-bold">
                        {feature.title}
                      </h3>

                      <p className="leading-relaxed text-muted">
                        {feature.description}
                      </p>
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
