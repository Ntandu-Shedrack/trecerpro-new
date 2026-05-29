import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Share2, ScanBarcode } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Integrations", "Pricing"],
  Resources: ["Documentation", "API Reference", "Webinars"],
  Company: ["About", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "SLA"],
};

export function Footer() {
  return (
    <footer className="w-full px-4 md:px-6 py-12 bg-dot-grid">
      <div className="max-w-7xl mx-auto glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden shadow-sm">
        {/* Glow decoration */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/5 rounded-full blur-[60px]" />

        {/* Top Grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6 relative z-10">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2 text-white shadow-md shadow-primary/20">
                <ScanBarcode className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                Tracer<span className="text-primary">Pro</span>
              </h2>
            </div>

            <p className="mb-8 max-w-xs text-muted-foreground leading-relaxed">
              The world&apos;s most trusted asset management platform for the
              modern enterprise.
            </p>

            <div className="flex gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-6 font-bold text-foreground text-sm uppercase tracking-wider">{category}</h4>

              <ul className="space-y-4 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="transition-colors hover:text-primary font-medium"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <Separator className="my-12 bg-border/40" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row relative z-10">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TracerPro Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Globe className="h-4 w-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
