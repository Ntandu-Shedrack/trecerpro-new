"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-white md:px-20">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary/5 px-8 py-16 text-center text-primary-foreground md:p-20">
          {/* Decorative Background Shapes */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-1/4 -top-1/4 h-150 w-150 rounded-full border-[40px] border-primary-foreground" />
            <div className="absolute -bottom-1/4 -left-1/4 h-64 w-64 rounded-full bg-primary-foreground" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight md:text-5xl">
              Ready to track your assets with precision?
            </h2>

            <p className="text-lg font-medium text-primary-foreground/90 md:text-xl">
              Join over 500+ enterprises managing millions of assets globally.
              Get started for free today.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-xl px-10"
              >
                Start Free Trial
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 rounded-xl px-10"
              >
                Request Custom Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
