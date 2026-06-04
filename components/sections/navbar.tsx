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
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border/40 px-6 md:px-20 py-4 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <ScanBarcode className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Tracer<span className="text-primary">Pro</span>
          </h2>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
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

        <div className="flex items-center gap-4">
          <ModeToggle />

          {isSignedIn ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                    {user?.fullName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold hidden md:inline-block">
                  {user?.fullName}
                </span>
              </div>

              <Button
                asChild
                variant="ghost"
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
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
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-bold"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:flex text-sm font-bold text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>

              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 dark:shadow-none active:scale-95"
                asChild
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
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
      className={`text-sm font-semibold transition-colors ${
        isActive
          ? "text-primary border-b-2 border-primary pb-1"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
