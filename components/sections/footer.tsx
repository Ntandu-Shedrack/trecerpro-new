import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Share2, ScanBarcode } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Integrations", "Enterprise", "Pricing"],
  Resources: ["Documentation", "API Reference", "Webinars", "Blog"],
  Company: ["About", "Careers", "Security", "Contact"],
  Legal: ["Privacy", "Terms", "SLA"],
};

export function Footer() {
  return (
    <footer className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2 text-white">
                <ScanBarcode className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Tracer<span className="text-primary">Pro</span>
              </h2>
            </div>

            <p className="mb-8 max-w-xs text-muted">
              The world&apos;s most trusted asset management platform for the
              modern enterprise.
            </p>

            <div className="flex gap-4 text-muted">
              <Link href="#" className="hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-6 font-semibold text-slate-900">{category}</h4>

              <ul className="space-y-4 text-sm text-muted">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="transition-colors hover:text-primary"
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
        <Separator className="my-12" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TracerPro Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
