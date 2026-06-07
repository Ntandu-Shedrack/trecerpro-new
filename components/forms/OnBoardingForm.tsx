"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSuggestedOrganizations, joinOrganization } from "@/actions/organization.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, ArrowRight, Loader2, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Organization } from "@/types";
import { motion } from "framer-motion";

interface OnboardingFormProps {
  userName: string;
  userEmail: string;
}

export function OnboardingForm({ userName, userEmail }: OnboardingFormProps) {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState<number | null>(null);
  const [suggestedOrgs, setSuggestedOrgs] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);

  const emailDomain = userEmail.split("@")[1] || "";
  const ignoredDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'aol.com', 'icloud.com', 'mail.com', 'msn.com',
    'live.com', 'zoho.com', 'yandex.com', 'protonmail.com',
    'proton.me', 'mailinator.com'
  ];
  const isPublicDomain = ignoredDomains.includes(emailDomain.toLowerCase());

  useEffect(() => {
    async function loadSuggested() {
      if (isPublicDomain) {
        setIsLoadingOrgs(false);
        return;
      }
      setIsLoadingOrgs(true);
      const res = await getSuggestedOrganizations();
      if (res.data) {
        setSuggestedOrgs(res.data);
      }
      setIsLoadingOrgs(false);
    }
    loadSuggested();
  }, [userEmail, isPublicDomain]);

  // Handle Organization Creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }
    setIsCreating(true);
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName,
          slug: orgSlug.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create organization");
      }

      toast.success("Organization created successfully!");
      router.push("/dashboard/overview");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Joining Organization
  const handleJoin = async (orgId: number) => {
    setIsJoining(orgId);
    try {
      const res = await joinOrganization(String(orgId));
      if (res.error) {
        throw new Error(res.error);
      }

      if (res.data?.status === "pending") {
        toast.success("Join request submitted successfully! Waiting for admin approval.");
        setSuggestedOrgs(prev =>
          prev.map(org => org.id === orgId ? { ...org, join_request_status: "pending" } : org)
        );
      } else {
        toast.success("Joined organization successfully!");
        router.push("/dashboard/overview");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to join organization");
    } finally {
      setIsJoining(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
      {/* Welcome banner */}
      <div className="text-center mb-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs mb-4"
        >
          <Sparkles className="h-3.5 w-3.5" /> Setup your workspace
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold text-foreground tracking-tight mb-3 animate-fade-in"
        >
          Welcome to TracerPro, {userName.split(" ")[0]}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          To get started, create a new workspace or join an existing one matching your email domain <span className="font-semibold text-foreground">@{emailDomain}</span>.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Card 1: Create Organization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-border/80 shadow-md hover:shadow-lg hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)] transition-all duration-300 flex flex-col backdrop-blur-sm bg-card/75">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                <Plus className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Create a new workspace</CardTitle>
              <CardDescription>Establish a fresh secure workspace environment for your assets, projects, and activities.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="org-name" className="text-foreground/80 font-medium">Workspace Name</Label>
                  <Input
                    id="org-name"
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value);
                      setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }}
                    required
                    className="h-10 border-input bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="org-slug" className="text-foreground/80 font-medium">Workspace Slug (URL-friendly)</Label>
                  <div className="relative">
                    <Input
                      id="org-slug"
                      placeholder="acme-corp"
                      value={orgSlug}
                      onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className="h-10 pr-20 border-input bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground select-none">
                      optional
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-md"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      Create Workspace <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Join Organization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-border/80 shadow-md hover:shadow-lg hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)] transition-all duration-300 flex flex-col backdrop-blur-sm bg-card/75">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 border border-teal-500/20">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Join existing workspace</CardTitle>
              <CardDescription>Discover workspaces registered under your email domain context.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-start">
              {isLoadingOrgs ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary animate-pulse" />
                  <span className="text-sm">Searching matching domains...</span>
                </div>
              ) : isPublicDomain ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400 space-y-2">
                  <p className="font-semibold">Public Domains Disabled</p>
                  <p className="text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                    You registered with a public email provider (<span className="font-semibold">{emailDomain}</span>). Auto-joining workspaces via public email domains is disabled to ensure organizational security. Please create a new workspace.
                  </p>
                </div>
              ) : suggestedOrgs.length === 0 ? (
                <div className="rounded-xl border border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground space-y-2 my-auto">
                  <Building2 className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="font-medium text-foreground">No matching workspaces found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any existing TracerPro workspaces matching the email domain <span className="font-semibold text-foreground/80">@{emailDomain}</span>. You can create a new workspace using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                    Available Workspaces ({suggestedOrgs.length})
                  </p>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {suggestedOrgs.map((org) => {
                      const isPending = org.join_request_status === "pending";
                      const requiresApproval = org.require_join_approval;

                      return (
                        <div
                          key={org.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm uppercase">
                              {org.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{org.name}</p>
                                {isPending ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    Pending Approval
                                  </span>
                                ) : requiresApproval ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                                    Needs Request
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    Auto-Join
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {org.pivot?.role === "owner" ? "Owned" : "Workspace"} • domain matching
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isPending ? "ghost" : requiresApproval ? "secondary" : "outline"}
                            disabled={isJoining !== null || isPending}
                            onClick={() => handleJoin(org.id)}
                            className={`h-8 transition-all duration-200 cursor-pointer ${isPending
                                ? "text-muted-foreground bg-muted/50 cursor-not-allowed"
                                : requiresApproval
                                  ? "text-primary border-primary/20 hover:bg-primary/10"
                                  : "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
                              }`}
                          >
                            {isJoining === org.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : isPending ? (
                              "Requested"
                            ) : requiresApproval ? (
                              "Request to Join"
                            ) : (
                              "Join"
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Logout / Switch Accounts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-muted-foreground text-sm flex items-center gap-3"
      >
        <span>Logged in as <span className="font-semibold text-foreground/80">{userEmail}</span></span>
        <span className="text-border">|</span>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </motion.div>
    </div>
  );
}
