"use client";

import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";

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

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-dot-grid px-4 md:px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] glass-card px-8 py-16 text-center md:p-20 shadow-2xl bg-gradient-to-br from-primary/10 via-indigo-500/5 to-zinc-950/10 border border-border/40"
        >
          {/* Decorative Background Shapes */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full border-[40px] border-primary blur-sm"
            />

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-1/4 -left-1/4 h-64 w-64 rounded-full bg-primary blur-md"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <motion.h2
              variants={item}
              className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight"
            >
              Ready to track your assets with <span className="text-gradient">precision?</span>
            </motion.h2>

            <motion.p
              variants={item}
              className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed max-w-lg mx-auto"
            >
              Join over 500+ enterprises managing millions of assets globally.
              Get started for free today.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-md shadow-primary/10 rounded-full px-10 h-14 active:scale-95 transition-transform"
                >
                  Start Free Trial
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border/80 bg-background/20 backdrop-blur-sm text-foreground hover:bg-muted font-bold rounded-full px-10 h-14 active:scale-95 transition-transform"
                >
                  Request Custom Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
