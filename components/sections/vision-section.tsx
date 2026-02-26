"use client";

import Image from "next/image";
import { History, Zap, PlayCircle } from "lucide-react";

export default function VisionSection() {
  return (
    <section className="py-24 md:px-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="px-6 mx-auto absolute inset-0 opacity-10 bg-[url('https://placeholder.pics/svg/1200')] bg-cover bg-center pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl text-slate-900 font-black mb-8 leading-tight">
              From Manual Chaos to <br />
              <span className="text-primary">Automated Accuracy</span>
            </h2>

            <div className="space-y-6">
              {/* Past */}
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg text-slate-800 font-bold mb-1">
                    The Past: Spreadsheets
                  </h4>
                  <p className="text-slate-600">
                    Manual entry, stale data, and &quot;lost&quot; assets were
                    the standard. Reconciliation took weeks and was prone to
                    human error.
                  </p>
                </div>
              </div>

              {/* Future */}
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg text-slate-800 font-bold mb-1">
                    The Future: TracerPro
                  </h4>
                  <p className="text-slate-600">
                    Instant scan-and-sync technology that updates your database
                    in milliseconds. Always know exactly what you have and where
                    it is.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content (Video Preview) */}
          <div className="relative">
            <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer z-10">
                <PlayCircle className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
              </div>

              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6WNwm-RZcAnB5l94HOoizFNvK4dqER0WFXb2VhbYLKBH9JNikIJhoqzfPVeJ3KoAwV3095YqNx8WI0LVs24bENqBQoRHwRtY8S8Y-O3_pkTZ1kFb9Z5gzPwelZTYoBor4QNAmSt3gHwhKojuWD5FVV8TFR28LT7BIz16t4NzSrhaFuQtF-vKNMzOrhzd58WHXLlS9vS_sRZWH85UiiUjz5g4zzU5evs1taB9M5aaSl3A2e-ouxEeqSZr6JrP3p4RnbKAerj4TSM"
                alt="Platform Dashboard Preview"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 blur-[80px] rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
