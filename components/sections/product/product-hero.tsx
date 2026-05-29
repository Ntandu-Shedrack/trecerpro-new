"use client";

import { easeOut, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <section className="relative overflow-hidden bg-dot-grid py-24 px-4 md:px-6">
      {/* Aurora floating backgrounds */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] animate-aurora-1 -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] animate-aurora-2 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full mb-6 shadow-sm shadow-primary/5">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                ENTERPRISE READY
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-8"
          >
            Product Features <span className="text-gradient">Overview</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Comprehensive enterprise asset management powered by precision barcode tracking. Streamline your inventory, track assets in real-time, and gain complete visibility into your operations.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:min-w-[180px] bg-primary hover:bg-primary/95 text-white h-14 px-8 font-bold shadow-md shadow-primary/20 rounded-full active:scale-95 transition-transform"
              >
                Book Demo
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:min-w-[180px] h-14 px-8 font-bold text-foreground hover:bg-muted rounded-full border-border/80 active:scale-95 transition-transform"
              >
                View Pricing
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
