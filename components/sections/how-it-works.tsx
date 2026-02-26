import { Card, CardContent } from "@/components/ui/card";
import { Network, LayoutList, Upload, BadgeCheck } from "lucide-react";

const steps = [
  {
    title: "Setup Project",
    description:
      "Map out your locations, departments, and user permissions in minutes.",
    icon: Network,
  },
  {
    title: "Define Categories",
    description:
      "Create custom metadata fields for IT, furniture, or fleet assets.",
    icon: LayoutList,
  },
  {
    title: "Upload Assets",
    description:
      "Bulk import via CSV or scan tags directly with our mobile app.",
    icon: Upload,
  },
  {
    title: "Verify & Track",
    description:
      "Execute live audits and get real-time location updates instantly.",
    icon: BadgeCheck,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight md:text-4xl">
            How TracerPro Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Four simple steps to total organizational control.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Desktop Connecting Line */}
          <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-12 bg-border lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={index}
                className="relative z-10 rounded-2xl border bg-primary/4 shadow-sm transition-colors hover:border-primary/50"
              >
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                  {/* Icon Circle */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="mb-2 text-xl text-slate-800 font-bold">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
