"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function ProductHero() {
  return (
    <section className="w-full bg-white md:px-20 py-24">
      <div className="container px-6 relative flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 rounded-2xl overflow-hidden bg-primary/5 border border-primary/10">
        {/* Background Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #137fec 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6 text-center max-w-3xl">
          <Badge
            variant="ghost"
            className="mx-auto uppercase tracking-widest text-xs text-primary font-bold"
          >
            Enterprise Ready
          </Badge>

          <h1 className="text-slate-900 text-4xl md:text-6xl font-black leading-tight tracking-tightest">
            Product Features Overview
          </h1>

          <p className="text-muted text-lg md:text-xl leading-relaxed">
            Comprehensive enterprise asset management powered by precision
            barcode tracking. Streamline your inventory, maintenance, and audit
            cycles in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="flex cursor-pointer items-center justify-center rounded-lg px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Book a Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="flex cursor-pointer items-center justify-center rounded-lg px-6 bg-primary text-slate-900 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
