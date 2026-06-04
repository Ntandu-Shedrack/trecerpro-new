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
    <section className="py-24 bg-background md:px-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-primary/5 px-8 py-16 text-center md:p-20"
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
              className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full border-[40px] border-primary"
            />

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-1/4 -left-1/4 h-64 w-64 rounded-full bg-primary"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <motion.h2
              variants={item}
              className="text-4xl font-extrabold text-foreground tracking-tight md:text-5xl"
            >
              Ready to track your assets with precision?
            </motion.h2>

            <motion.p
              variants={item}
              className="text-lg font-medium text-muted-foreground md:text-xl"
            >
              Join over 500+ enterprises managing millions of assets globally.
              Get started for free today.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.06 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-10"
                >
                  Start Free Trial
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.06 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary/40 bg-transparent text-primary hover:bg-primary/10 rounded-xl px-10"
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
