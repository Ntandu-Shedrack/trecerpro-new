"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  QrCode,
  Download,
  Apple,
  PlayCircle,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
  History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.9-79.1 24.1-100.4 61.1-44.1 76.3-11.3 190.1 31.2 251.3 20.8 30 45.6 63.6 77.8 62.4 31.1-1.2 42.8-20.1 80.5-20.1 37.7 0 48.4 20.1 81 19.5 33.1-.6 54.8-30.3 75.5-60.2 24-34.8 33.9-68.5 34.1-70.2-.8-.3-66-25.3-66.7-100.9zM266.3 84.4c16.1-19.5 26.8-46.7 23.8-73.8-23.4 1-51.7 15.6-68.5 35.2-15.1 17.5-28.3 45.5-24.8 71.9 26.1 2 53.4-13.8 69.5-33.3z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l236.6-236.6L47 0zm396.6 272.3l-60.1-60.1-60.1 60.1 60.1 60.1 60.1-60.1zM104.6 499L325.3 277.7l60.1 60.1L104.6 499z" />
    </svg>
  );
}

export function MobileAppInstructions() {
  const steps = [
    {
      title: "Download the App",
      description: "Available on the App Store and Google Play Store. Search for 'TracerPro'.",
      icon: Download,
    },
    {
      title: "Sign In",
      description: "Use your existing TracerPro account to sync all your projects and assets.",
      icon: Smartphone,
    },
    {
      title: "Scan & Verify",
      description: "Point your camera at any TracerPro QR code to instantly view asset details.",
      icon: QrCode,
    },
  ];

  const faqs = [
    {
      question: "Which devices are supported?",
      answer: "The TracerPro app is compatible with iOS 15.0+ and Android 8.0+ devices with a working camera."
    },
    {
      question: "Can I use it offline?",
      answer: "Yes, you can scan assets offline. The data will sync once you are back online."
    },
    {
      question: "Is there a limit to scans?",
      answer: "No, you can scan as many assets as needed with any active subscription plan."
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-4 px-4 sm:px-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Mobile Application</h2>
        <p className="text-muted-foreground text-lg">
          Take your asset management into the field with the TracerPro scanner app.
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="features">App Features</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Follow these steps to enable mobile verification.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8">
                  <div className="flex flex-col gap-6">
                    {steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <Badge variant="outline" className="size-8 rounded-full flex items-center justify-center p-0 shrink-0 mt-1 font-bold">
                          {index + 1}
                        </Badge>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Alert className="bg-muted/50 border-none">
                    <Info />
                    <AlertTitle>Requirements</AlertTitle>
                    <AlertDescription>
                      Ensure your device has a working camera and an active internet connection for the initial setup.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="text-primary" />
                    Download Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" variant="default">
                    <AppStoreIcon />
                    App Store
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <GooglePlayIcon />
                    Google Play
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl blur-3xl -z-10" />
              <Card className="h-full border-0 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center p-12 relative">
                <div className="w-64 h-[500px] border-[8px] border-border rounded-[3rem] shadow-xl overflow-hidden relative bg-background mx-auto">
                  <div className="absolute top-0 inset-x-0 h-14 bg-background border-b flex items-center justify-center font-semibold z-10">
                    TracerPro
                  </div>
                  <div className="absolute top-14 inset-x-0 bottom-0 bg-muted/30 p-4 flex flex-col gap-4">
                    <style>{`
                          @keyframes scan {
                            0%, 100% { top: 10%; }
                            50% { top: 90%; }
                          }
                          .animate-scan {
                            animation: scan 3s ease-in-out infinite;
                          }
                        `}</style>
                    <div className="h-48 bg-card rounded-2xl shadow-sm border flex items-center justify-center flex-col gap-2 relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                      <QrCode className="size-12 text-primary" />
                      <span className="font-medium text-sm text-muted-foreground group-hover:text-primary transition-colors">Ready to Scan</span>
                      <div className="absolute inset-x-4 h-0.5 bg-primary/50 shadow-[0_0_8px_2px_rgba(var(--primary),0.5)] animate-scan" />
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Recent Activity</div>
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-card rounded-xl shadow-sm border p-3 flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="size-5 text-primary" />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-2 w-1/2 bg-muted rounded" />
                            <div className="h-2 w-3/4 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-6 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col gap-3 p-6">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-lg">Secure Verification</h4>
                <p className="text-sm text-muted-foreground">Encrypted asset verification ensures data integrity and authenticity at every scan.</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="size-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-lg">Instant Results</h4>
                <p className="text-sm text-muted-foreground">Blazing fast QR code recognition with near-zero latency response for quick audits.</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <History className="size-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-lg">Offline History</h4>
                <p className="text-sm text-muted-foreground">Access your recent scans and cached asset data even without an active internet connection.</p>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
              <p className="text-muted-foreground text-sm">Find answers to common questions about the TracerPro mobile app.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
