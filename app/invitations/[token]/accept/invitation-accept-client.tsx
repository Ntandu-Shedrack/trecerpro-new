"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/auth-context";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInvitation } from "@/actions/organization.actions";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { Building2, UserCheck, AlertTriangle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import type { User } from "@/types";

interface InvitationAcceptClientProps {
  token: string;
  invitationContext: {
    invitation?: {
      id: number | string;
      email: string;
      role: string;
      organization?: {
        id: number | string;
        name: string;
      };
    };
    user_exists?: boolean;
    organization?: {
      name: string;
    };
  };
  initialUser: User | null;
}

export default function InvitationAcceptClient({
  token,
  invitationContext,
  initialUser,
}: InvitationAcceptClientProps) {
  const { user: clientUser, refreshUser, logout } = useAuthContext();
  const currentUser = clientUser || initialUser;

  // Extract invitation details safely
  const invitation = invitationContext?.invitation;
  const email = invitation?.email || "";
  const role = invitation?.role || "member";
  const orgName =
    invitation?.organization?.name ||
    invitationContext?.organization?.name ||
    "the Organization";
  const userExists = invitationContext?.user_exists || false;

  const [loading, setLoading] = useState(false);

  // Form states (for unauthenticated)
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isEmailMismatch =
    currentUser && currentUser.email.toLowerCase() !== email.toLowerCase();

  const handleAcceptDirectly = async () => {
    setLoading(true);
    try {
      const res = await acceptInvitation(token);
      if (res.error) {
        throw new Error(res.error);
      }
      toast.success("Successfully joined the organization!");
      await refreshUser();
      // Redirect to dashboard
      window.location.href = "/dashboard/overview";
    } catch (err: any) {
      toast.error(err.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userExists && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {};
      if (userExists) {
        // Log in existing user and accept
        payload.email = email;
        payload.password = password;
      } else {
        // Register new user and accept
        payload.name = `${firstname} ${lastname}`.trim();
        payload.email = email;
        payload.password = password;
        payload.password_confirmation = confirmPassword;
      }

      const res = await acceptInvitation(token, payload);
      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        userExists
          ? "Successfully signed in and accepted invitation!"
          : "Successfully registered account and accepted invitation!"
      );
      await refreshUser();
      window.location.href = "/dashboard/overview";
    } catch (err: any) {
      toast.error(err.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.info("Logged out successfully. Please sign in or accept invitation.");
    } catch (err: any) {
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <Toaster position="top-right" richColors closeButton />
      {/* Background Aurora Blobs */}
      <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <LogoIcon />
        </div>

        <Card className="glass-card border border-border/80 shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 border border-primary/20">
              <Building2 className="h-6 w-6 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-black text-foreground tracking-tight">
              Organization Invitation
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              You have been invited to join <span className="font-bold text-foreground">{orgName}</span> as a <span className="font-semibold text-primary capitalize">{role}</span>.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {currentUser ? (
              /* --- Logged In View --- */
              <div className="space-y-6">
                {isEmailMismatch ? (
                  /* Email mismatch warning */
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-500 flex gap-3 text-xs leading-relaxed">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-bold">Account Mismatch Warning</p>
                      <p className="mt-1">
                        This invitation is for <span className="font-semibold underline">{email}</span>, but you are currently logged in as <span className="font-semibold underline">{currentUser.email}</span>.
                      </p>
                      <p className="mt-1">
                        Accepting will link this invitation to your current account ({currentUser.email}).
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Perfect match status */
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 flex gap-3 text-xs leading-relaxed">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-bold">Verified Session</p>
                      <p className="mt-1">
                        You are logged in as <span className="font-semibold">{currentUser.email}</span>, matching the invitation email.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleAcceptDirectly}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    {loading ? "Accepting Invite..." : "Accept Invitation & Join"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {isEmailMismatch && (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      disabled={loading}
                      className="w-full border-border/80 hover:bg-muted text-muted-foreground h-12 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
                    >
                      Sign Out and Switch Accounts
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* --- Logged Out / Registration / Sign In View --- */
              <form onSubmit={handleRegisterAndAccept} className="space-y-4">
                {userExists ? (
                  /* Existing user login flow */
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 text-xs flex gap-2.5 items-center">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span>You already have an account! Enter password to join.</span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-muted border border-border/80 rounded-xl h-11 pl-10 focus-visible:ring-0 cursor-not-allowed opacity-70"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pass"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-background border border-border/80 rounded-xl h-11 pl-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Brand new user registration flow */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="fname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          First Name
                        </Label>
                        <Input
                          id="fname"
                          type="text"
                          required
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          placeholder="John"
                          className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Last Name
                        </Label>
                        <Input
                          id="lname"
                          type="text"
                          required
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          placeholder="Doe"
                          className="bg-background border border-border/80 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-muted border border-border/80 rounded-xl h-11 pl-10 focus-visible:ring-0 cursor-not-allowed opacity-70"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pass"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-background border border-border/80 rounded-xl h-11 pl-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPass"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-background border border-border/80 rounded-xl h-11 pl-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-6"
                >
                  {loading ? "Processing..." : userExists ? "Accept Invitation & Sign In" : "Accept Invitation & Sign Up"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
