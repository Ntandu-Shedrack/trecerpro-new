"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  Upload,
  Barcode,
  History,
  LayoutDashboard,
  RefreshCcw,
  Shield,
  Braces,
  ArrowRight,
} from "lucide-react";
import { CTASection } from "../cta-section";

const coreFeatures = [
  {
    title: "Asset Management",
    description:
      "Full lifecycle tracking from procurement to retirement with real-time updates and maintenance scheduling.",
    icon: Boxes,
  },
  {
    title: "Bulk Upload",
    description:
      "Seamlessly import thousands of records. Support for complex legacy data formats ensures rapid onboarding.",
    icon: Upload,
    badge: "CSV / Excel",
  },
  {
    title: "Barcode Assignment",
    description:
      "Generate and print unique asset identifiers. Compatible with standard label printers and mobile scanning devices.",
    icon: Barcode,
  },
  {
    title: "Verification History",
    description:
      "Maintain a complete immutable audit trail for compliance. Track who, when, and where for every single interaction.",
    icon: History,
  },
];

const advancedFeatures = [
  {
    title: "Real-time Cloud Sync",
    description:
      "Every scan is instantly synced across your entire organization, ensuring no duplicate entries or missing items.",
    icon: RefreshCcw,
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "256-bit AES encryption at rest and in transit. Role-based access control (RBAC) ensures data stays in the right hands.",
    icon: Shield,
  },
  {
    title: "Scalable GraphQL API",
    description:
      "Connect your ERP, CRM, or custom internal tools using our robust developer-first API layer.",
    icon: Braces,
  },
];

export default function ProductFeatures() {
  return (
    <>
      {/* ================= CORE FEATURE GRID ================= */}
      <section className="w-full bg-white md:px-20 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-4 mb-12">
            <h2 className="text-3xl text-slate-900 font-bold tracking-tight">
              Core Enterprise Capabilities
            </h2>
            <p className="text-muted text-lg max-w-2xl">
              Everything you need to manage your asset lifecycle with
              confidence, transparency, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={index}
                  className="group transition-all border border-slate-300 rounded-lg hover:shadow-xl bg-white hover:border-primary/40"
                >
                  <CardHeader className="group flex flex-col space-y-4">
                    <div className="hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
                      <Icon className="w-12 h-12 bg-primary/7 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors" />
                    </div>

                    <div>
                      <div className="flex items-center text-slate-900 gap-2">
                        <CardTitle>{feature.title}</CardTitle>
                        {feature.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                          >
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-muted">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DETAILED RELIABILITY SECTION ================= */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard Mockup */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-background">
              <div className="h-80 w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                <LayoutDashboard className="h-20 w-20 text-primary/20" />
              </div>

              <div className="absolute bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg border w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Live Sync Active
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <h2 className="text-3xl text-slate-900 font-bold leading-tight">
              Advanced Platform Reliability
            </h2>

            <div className="space-y-6">
              {advancedFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="text-primary mt-1">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xl">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <Button variant="link" className="px-0 font-semibold">
                Explore all integrations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
