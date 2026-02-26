"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm px-6 md:px-20 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <ScanBarcode className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Tracer<span className="text-primary">Pro</span>
          </h2>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink href="/product">Product</NavLink>
          <NavLink href="/solutions">Solutions</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/support">Support</NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden sm:flex text-sm font-bold text-slate-700 hover:text-primary"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>

          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
