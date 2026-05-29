"use client";

import { useState } from "react";
import { ArrowRight, Play, Battery, Radio, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  },
};

const assetsMock = {
  all: [
    { name: "CAT Excavator 320", location: "Zone A-1", battery: "98%", status: "Tracking", signal: "Excellent" },
    { name: "John Deere 8R Tractor", location: "Main Field", battery: "84%", status: "Tracking", signal: "Good" },
    { name: "Volvo Loader L150H", location: "Sector 4", battery: "42%", status: "Warning", signal: "Poor" }
  ],
  geofenced: [
    { name: "GenSet 150kVA", location: "Warehouse 2", battery: "100%", status: "Locked", signal: "Excellent" },
    { name: "Tool Trailer #4", location: "North Gates", battery: "92%", status: "Locked", signal: "Excellent" }
  ],
  maintenance: [
    { name: "Komatsu Dozer D65", location: "Service Bay 3", battery: "65%", status: "Service", signal: "Off-line" }
  ]
};

type TabType = "all" | "geofenced" | "maintenance";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <section className="w-full bg-background min-h-screen flex items-center relative overflow-hidden bg-dot-grid py-20 md:py-28 px-4 md:px-6">
      {/* Aurora floating backgrounds */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] animate-aurora-1 -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] animate-aurora-2 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 flex flex-col gap-6 md:gap-8"
          >
            {/* Tag Badge */}
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-sm shadow-primary/5">
                <Radio className="h-3.5 w-3.5 animate-pulse text-primary" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                  New: Live IoT Beacon Tracking
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.1] tracking-tight"
            >
              Precision Asset <span className="text-gradient">Management.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
            >
              Streamline your enterprise inventory with TracerPro&apos;s
              highly-secure live IoT barcode tracking. Reduce loss, automate
              reporting, and sync coordinates in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-4 items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-base font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 rounded-full active:scale-95 transition-all"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-bold rounded-full border-border/80 hover:bg-muted active:scale-95 transition-all"
              >
                <Link href="/support" className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary fill-primary" />
                  Request Demo
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={item}
              className="flex items-center gap-4 pt-4 border-t border-border/30 max-w-md"
            >
              <div className="flex -space-x-3">
                {[12, 25, 47].map((i) => (
                  <Avatar
                    key={i}
                    className="border-2 border-background h-10 w-10 shadow-md"
                  >
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">U</AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground">
                  Trusted by 500+ Enterprises
                </p>
                <p className="text-xs text-muted-foreground font-semibold">
                  Tracking $4B+ in active industrial gear.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - INTERACTIVE MOCK PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-60 animate-pulse-glow pointer-events-none" />

            <div className="relative glass-card rounded-[2rem] shadow-2xl border border-border/40 overflow-hidden">
              {/* Window Chrome Header */}
              <div className="h-10 bg-zinc-950/20 border-b border-border/20 flex items-center justify-between px-6">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Live Console
                </span>
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </div>

              {/* Console Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Tabs Selector */}
                <div className="flex bg-muted/60 p-1 rounded-full border border-border/40 max-w-sm">
                  {(["all", "geofenced", "maintenance"] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 text-center py-2 text-xs font-bold capitalize rounded-full transition-all ${
                        activeTab === tab
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "all" ? "All Gears" : tab}
                    </button>
                  ))}
                </div>

                {/* Simulated Telemetry list */}
                <div className="min-h-[220px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {assetsMock[activeTab].map((asset, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/40 hover:bg-card hover:border-primary/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              {asset.status === "Warning" ? (
                                <ShieldAlert className="h-5 w-5 text-amber-500" />
                              ) : asset.status === "Service" ? (
                                <Cpu className="h-5 w-5 text-blue-500" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{asset.name}</h4>
                              <p className="text-[10px] text-muted-foreground font-semibold">
                                Location: {asset.location}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5">
                              <Battery className="h-4 w-4 text-muted-foreground" />
                              <span className="text-[10px] font-bold text-foreground">{asset.battery}</span>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              asset.status === "Warning" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                              asset.status === "Service" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                              "bg-green-500/10 text-green-500 border border-green-500/20"
                            }`}>
                              {asset.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
