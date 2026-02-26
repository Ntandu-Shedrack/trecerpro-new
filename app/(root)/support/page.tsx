"use client";

import Image from "next/image";
import {
  MapPin,
  Mail,
  HelpCircle,
  ExternalLink,
  Send,
  CheckCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
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

export default function ContactPage() {
  return (
    <main className="bg-white py-24 md:px-20">
      {/* Header */}
      <div className="container px-6 mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl text-slate-900 font-black tracking-tight mb-4">
            Contact TracerPro Support & Sales
          </h1>
          <p className="text-md text-slate-600 max-w-2xl leading-relaxed">
            Get in touch with our team for enterprise asset management
            solutions. We typically respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT PANEL */}
          <div className="lg:col-span-5 space-y-10">
            <Card className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-8">
                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
                      Office Location
                    </h4>
                    <p className="text-base text-slate-600 font-medium">
                      123 Enterprise Way, Tech Suite 500
                      <br />
                      San Francisco, CA 94105
                    </p>
                    <a
                      href="#"
                      className="text-primary text-sm font-semibold mt-2 inline-flex items-center gap-1 hover:underline"
                    >
                      View on Map <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
                      Email Support
                    </h4>
                    <div className="space-y-1 text-base">
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-600">
                          Sales:
                        </span>{" "}
                        sales@tracerpro.com
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-600">
                          Support:
                        </span>{" "}
                        support@tracerpro.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help Center */}
                <div className="flex gap-4">
                  <div className="w-22 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
                      Help Center
                    </h4>
                    <p className="text-base text-slate-600 mb-2">
                      Visit our documentation for quick guides and
                      troubleshooting.
                    </p>
                    <a
                      href="#"
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      Go to Docs →
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <div className="rounded-xl overflow-hidden h-48 relative border border-slate-200 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="absolute inset-0 bg-primary/5" />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzmO_FPIH8arcfCI7h4lwGzsK8UQZvKRB5V6voFf2KMQUol1cS_LnWyGPtPg9MO051GKdRkgAEyVq2dFcHD-vtxn2tWbSirqFIbrusWxLDeVGwe-DJkitUxo5oirEeNrgrmtelUV-0cMtHblrNwoKjP_c8zWdD1Be8RQRPdKjAZ1z8-tdVxiOFPSybODhznCiO4MrtfJTMaBFU6pOe6atTqmEkeYiX_-1bxRm8-bWugTKsSNm9DdPKXcZ6A2qLQGbxEZYw1dtXWzE"
                alt="San Francisco location"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT PANEL - FORM */}
          <div className="lg:col-span-7">
            <Card className="bg-white p-8 lg:p-10 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl text-slate-900 font-bold mb-8">
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
                ß
                <div className="space-y-2">
                  <Label className="text-slate-600">Your Message</Label>
                  <Textarea rows={5} placeholder="Tell us how we can help..." />
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[180px] h-14 text-white font-bold flex items-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
