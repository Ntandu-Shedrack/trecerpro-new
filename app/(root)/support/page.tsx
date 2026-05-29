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
    <main className="bg-white py-24 md:px-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mb-12 max-w-3xl"
        >
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Contact TracerPro Support & Sales
          </h1>
          <p className="text-slate-600 text-md leading-relaxed">
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
            className="lg:col-span-5 flex flex-col gap-10"
          >
            <Card className="p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
              <CardContent className="space-y-8 p-0">
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
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
                          {item.title}
                        </h4>
                        <div className="text-base text-slate-600 font-medium">
                          {item.description}
                        </div>
                        {item.linkText && item.linkHref && (
                          <a
                            href={item.linkHref}
                            className="text-primary text-sm font-semibold mt-2 inline-flex items-center gap-1 hover:underline transition-all"
                          >
                            {item.linkText}{" "}
                            {item.linkText.includes("Map") && (
                              <ExternalLink className="h-3 w-3" />
                            )}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative rounded-xl overflow-hidden h-48 border border-slate-200 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
            >
              <div className="absolute inset-0 bg-primary/5" />
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <Card className="p-8 bg-white lg:p-10 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Send us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-600">Full Name</Label>
                    <Input placeholder="John Doe" className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600">Business Email</Label>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Subject</Label>
                  <Select>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="General Inquiry" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label className="text-slate-600">Your Message</Label>
                  <Textarea rows={5} placeholder="Tell us how we can help..." />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[180px] h-14 text-white font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
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
