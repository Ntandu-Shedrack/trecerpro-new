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

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden hero-gradient bg-background md:px-20 py-24">
      <div className="container px-6 mx-auto">
        {/* Animated Background Pattern */}
        <motion.div
          aria-hidden="true"
          animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
          transition={{
            duration: 25,
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

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
        >
          <motion.div variants={item}>
            <Badge className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              Our Mission
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-8"
          >
            Empowering institutions to master physical inventory with{" "}
            <span className="text-primary">scan-and-go</span> simplicity.
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
          >
            TracerPro redefines enterprise asset management by providing a
            seamless, reliable, and scalable barcode-based solution for the
            world&apos;s most complex organizations.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="lg"
                className="min-w-[180px] bg-primary text-white h-12 px-8 font-bold shadow-lg shadow-primary/20"
              >
                Get Started Today
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[180px] h-12 px-8 font-bold text-foreground hover:bg-muted"
              >
                View Product Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
