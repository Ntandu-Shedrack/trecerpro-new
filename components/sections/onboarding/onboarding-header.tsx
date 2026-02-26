"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LifeBuoy, LogOut, ScanBarcode, User } from "lucide-react";

type OnboardingHeaderProps = {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onLogout?: () => void;
};

export default function OnboardingHeader({
  userName = "User",
  userEmail,
  userImage,
  onLogout,
}: OnboardingHeaderProps) {
  return (
    <header className="sticky top-0 z-50  border-b border-slate-300 px-6 py-4 lg:px-20 backdrop-blur-sm">
      {/* Logo */}
      <div className="container mx-auto flex items-center justify-between">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2 text-white">
            <ScanBarcode className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Tracer<span className="text-primary">Pro</span>
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Support Button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <LifeBuoy className="h-4 w-4" />
            Support
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0"
              >
                <Avatar className="h-9 w-9">
                  {userImage && <AvatarImage src={userImage} alt={userName} />}
                  <AvatarFallback>
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <span className="text-sm font-medium">{userName}</span>
                {userEmail && (
                  <span className="text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
