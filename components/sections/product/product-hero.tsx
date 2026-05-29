"use client";

import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

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
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export default function ProductHero() {
  return (
    <section className="w-full bg-white md:px-20 py-24 overflow-hidden">
      <div className="container px-6 mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative flex min-h-[420px] flex-col items-center justify-center gap-6 p-10 rounded-2xl overflow-hidden bg-primary/5 border border-primary/10 text-center"
        >
          {/* Animated Background Pattern */}
          <motion.div
            aria-hidden="true"
            animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #137fec 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
            <motion.div variants={item}>
              <Badge
                variant="ghost"
                className="mx-auto uppercase tracking-widest text-xs text-primary font-bold"
              >
                Enterprise Ready
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-slate-900 text-4xl md:text-6xl font-black leading-tight tracking-tight"
            >
              Product Features Overview
            </motion.h1>

            <motion.p
              variants={item}
              className="text-muted text-lg md:text-xl leading-relaxed"
            >
              Comprehensive enterprise asset management powered by precision
              barcode tracking. Streamline your inventory, maintenance, and
              audit cycles in one platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  className="flex items-center justify-center rounded-lg px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center justify-center rounded-lg px-6 text-slate-900 text-base font-bold"
                >
                  View Pricing
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
