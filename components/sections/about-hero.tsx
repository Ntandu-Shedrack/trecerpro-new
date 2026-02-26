"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden hero-gradient bg-white md:px-20 py-24">
      <div className="container px-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #137fec 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Badge className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Our Mission
          </Badge>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
            Empowering institutions to master physical inventory with{" "}
            <span className="text-primary">scan-and-go</span> simplicity.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            TracerPro redefines enterprise asset management by providing a
            seamless, reliable, and scalable barcode-based solution for the
            world&apos;s most complex organizations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="min-w-[180px] bg-primary text-white h-12 px-8 font-bold shadow-lg shadow-primary/20 hover:translate-y-[-1px] transition-all"
            >
              Get Started Today
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px] h-12 px-8 font-bold text-slate-900 hover:bg-slate-50 transition-all"
            >
              View Product Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
