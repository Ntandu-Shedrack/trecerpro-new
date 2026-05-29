"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScanBarcode, LayoutDashboard, LogOut } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { useUser, useAuthContext } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const { logout } = useAuthContext();

  const links = [
    { href: "/product", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
  ];

  return (
    <div className="w-full px-4 md:px-6 sticky top-4 z-50">
      <header className="w-full max-w-7xl mx-auto bg-background/50 backdrop-blur-lg border border-border/40 px-6 py-3 rounded-full shadow-lg shadow-zinc-950/5 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-foreground">
              Tracer<span className="text-primary">Pro</span>
            </h2>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                isActive={pathname === link.href}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ModeToggle />

            {isSignedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {user?.fullName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold hidden lg:inline-block">
                    {user?.fullName}
                  </span>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                >
                  <Link href="/dashboard/overview">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-bold rounded-full hover:bg-muted"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden sm:flex text-sm font-bold text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>

                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-md shadow-primary/20 dark:shadow-none rounded-full active:scale-95 transition-transform"
                  asChild
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-semibold transition-all px-4 py-2 rounded-full ${
        isActive
          ? "text-primary bg-primary/10 shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </Link>
  );
}
