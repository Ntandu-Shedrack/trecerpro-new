import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const settingsLinks = [
  { href: "/dashboard/settings/organization", label: "Organization" },
  { href: "/dashboard/settings/billing", label: "Billing" },
  { href: "/dashboard/settings/mobile-app", label: "Mobile App" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace, billing, and integrations.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {settingsLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground",
              "hover:bg-muted hover:text-foreground transition-colors"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Separator />
      {children}
    </div>
  );
}
