"use client";

import Image from "next/image";
import { MapPin, Mail, HelpCircle, ExternalLink, Send } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const contacts = [
  {
    title: "Office Location",
    icon: MapPin,
    description: (
      <>
        123 Enterprise Way, Tech Suite 500
        <br />
        San Francisco, CA 94105
      </>
    ),
    linkText: "View on Map",
    linkHref: "#",
  },
  {
    title: "Email Support",
    icon: Mail,
    description: (
      <>
        <p>
          <span className="font-medium">Sales:</span> sales@tracerpro.com
        </p>
        <p>
          <span className="font-medium">Support:</span> support@tracerpro.com
        </p>
      </>
    ),
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    description: (
      <>Visit our documentation for quick guides and troubleshooting.</>
    ),
    linkText: "Go to Docs →",
    linkHref: "#",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring" as const, stiffness: 100 },
  }),
};

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-dot-grid py-24 px-4 md:px-6 min-h-screen">
      {/* Background Aurora Blobs */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] animate-aurora-1 -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] animate-aurora-2 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mb-16 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
            Contact Support & <span className="text-gradient">Sales</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Get in touch with our team for enterprise asset management
            solutions. We typically respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT PANEL */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            <div className="space-y-6">
              {contacts.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Card className="glass-card glass-card-hover rounded-3xl border border-border/40 overflow-hidden p-6 shadow-sm">
                      <CardContent className="flex gap-4 p-0">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                            {item.title}
                          </h4>
                          <div className="text-xs text-muted-foreground font-semibold leading-relaxed">
                            {item.description}
                          </div>
                          {item.linkText && item.linkHref && (
                            <a
                              href={item.linkHref}
                              className="text-primary text-xs font-bold mt-3 inline-flex items-center gap-1 hover:underline transition-all"
                            >
                              {item.linkText}{" "}
                              {item.linkText.includes("Map") && (
                                <ExternalLink className="h-3 w-3" />
                              )}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative rounded-3xl overflow-hidden h-48 border border-border/40 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none" />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzmO_FPIH8arcfCI7h4lwGzsK8UQZvKRB5V6voFf2KMQUol1cS_LnWyGPtPg9MO051GKdRkgAEyVq2dFcHD-vtxn2tWbSirqFIbrusWxLDeVGwe-DJkitUxo5oirEeNrgrmtelUV-0cMtHblrNwoKjP_c8zWdD1Be8RQRPdKjAZ1z8-tdVxiOFPSybODhznCiO4MrtfJTMaBFU6pOe6atTqmEkeYiX_-1bxRm8-bWugTKsSNm9DdPKXcZ6A2qLQGbxEZYw1dtXWzE"
                alt="San Francisco location"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL - FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <Card className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-border/40 shadow-2xl bg-gradient-to-br from-card via-indigo-500/5 to-zinc-950/10 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-8 tracking-tight">
                Send us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input placeholder="John Doe" className="h-12 rounded-xl bg-background border border-border/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Email</Label>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      className="h-12 rounded-xl bg-background border border-border/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl bg-background border border-border/80 focus:ring-2 focus:ring-primary focus:ring-offset-0">
                      <SelectValue placeholder="General Inquiry" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="sales">
                        Sales & Enterprise Pricing
                      </SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Message</Label>
                  <Textarea rows={5} placeholder="Tell us how we can help..." className="rounded-xl bg-background border border-border/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[180px] h-14 bg-primary hover:bg-primary/95 text-white font-bold rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md shadow-primary/20 transition-all active:scale-95"
                  >
                    Send Message
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
