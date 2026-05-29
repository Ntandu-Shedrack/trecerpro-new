"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, easeOut } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function HeroSection() {
  return (
    <section className="w-full bg-white md:px-20 py-24 overflow-hidden">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            {/* Badge */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit"
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                New: AI Auto-Categorization
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight"
            >
              Precision Asset Management.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-lg md:text-xl text-muted leading-relaxed max-w-lg"
            >
              Streamline your enterprise inventory with TracerPro&apos;s
              professional barcode tracking system. Reduce loss, eliminate
              errors, and improve accuracy today.
            </motion.p>

            {/* CTA */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-bold shadow-xl shadow-primary/25"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-lg font-bold"
                >
                  Request Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={item}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <Avatar
                    key={i}
                    className="border-2 border-background h-10 w-10"
                  >
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <p className="text-sm font-medium text-muted">
                Trusted by 500+ global enterprises
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="relative group"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-3xl group-hover:bg-primary/30 transition-all duration-500" />

              <div className="relative rounded-2xl border shadow-2xl overflow-hidden bg-card">
                {/* Window Chrome */}
                <div className="h-8 bg-muted flex items-center gap-1.5 px-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA49mLpvkou9uqeBG2s8cHpbUKOr_38q5455mf2XyQdLtbg_R7MZYtm8mz0_Fm5gpshREfqpzdfayZ21w66qroWyZ7yO9pf79pAPzgVbQJEa6BzHdpUgW_bpJBpPiog3Tv816AIl9vzGd0jLzSVEH40GLKv8LOvtU9ZUG9ieKMmnX7-_4BjUt9t4GfmuCzM8bjByRpPIRd5QuL-ZZ5IGwm7ZAc0FW_0jlQCFQHK2Qk8k7DWwAihMQwG8Il5toIYXcGeFyVWt2LtmFs"
                  alt="TracerPro Dashboard"
                  width={1200}
                  height={675}
                  className="w-full aspect-video object-cover"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
