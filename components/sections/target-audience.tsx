"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Shield, Building2, Truck, CheckCircle } from "lucide-react";

const audience = [
  {
    title: "IT Managers",
    description:
      "Streamline hardware lifecycle tracking from procurement to retirement. Ensure security compliance with automated audit trails and real-time equipment location data.",
    icon: Shield,
    points: ["License Compliance", "Security Patch Tracking"],
  },
  {
    title: "Facility Coordinators",
    description:
      "Optimize physical space utilization. Track furniture, heavy machinery, and maintenance schedules across multiple campuses with precision location tagging.",
    icon: Building2,
    points: ["Maintenance Alerts", "Floor Plan Integration"],
  },
  {
    title: "Logistics Leads",
    description:
      "Eliminate supply chain bottlenecks. Monitor movement of critical assets between facilities with high-speed barcode scanning and real-time transit visibility.",
    icon: Truck,
    points: ["Chain of Custody", "Inventory Forecasting"],
  },
];

export default function TargetAudience() {
  return (
    <section className="py-24 bg-white md:px-20">
      <div className="container px-6 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built for the Leaders of Infrastructure
            </h2>
            <p className="text-slate-600 text-lg">
              We design our workflows around the specific needs of the
              professionals who keep modern enterprises running smoothly every
              single day.
            </p>
          </div>

          <div className="h-[1px] flex-grow mb-4 mx-8 hidden lg:block" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audience.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <CardContent className="p-0">
                  <div className="size-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl text-slate-900 font-bold mb-4">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-3">
                    {item.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-500"
                      >
                        <CheckCircle className="h-[18px] w-[18px] text-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
