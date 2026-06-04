"use server";

import { getInvitationContext } from "@/actions/organization.actions";
import { getSession } from "@/lib/auth/session";
import InvitationAcceptClient from "./invitation-accept-client";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitationAcceptPage({ params }: PageProps) {
  const { token } = await params;

  // 1. Fetch invitation context
  const { data: invitationContext, error } = await getInvitationContext(token);

  // 2. Fetch current user session
  const { user } = await getSession();

  // 3. Render error view if invalid or expired invitation
  if (error || !invitationContext) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-background bg-dot-grid">
        <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-destructive/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-yellow-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <LogoIcon />
          </div>

          <div className="glass-card border border-destructive/20 shadow-xl rounded-3xl p-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive border border-destructive/20">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-foreground tracking-tight">
                Invalid or Expired Invitation
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The invitation link you followed is invalid, has expired, or was revoked by the organization administrator.
              </p>
              {error && (
                <p className="text-xs bg-muted/50 text-muted-foreground p-3 rounded-xl border border-border/50 break-words mt-3">
                  Error Details: {error}
                </p>
              )}
            </div>

            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Render main invitation accepting page
  return (
    <InvitationAcceptClient
      token={token}
      invitationContext={invitationContext}
      initialUser={user}
    />
  );
}
