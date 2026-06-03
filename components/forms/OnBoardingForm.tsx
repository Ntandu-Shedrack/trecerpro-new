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

interface OnboardingFlowProps {
  userName: string;
  userEmail: string;
}

export function OnboardingFlow({ userName, userEmail }: OnboardingFlowProps) {
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
      toast.success("Joined organization successfully!");
      router.push("/dashboard/overview");
      router.refresh();
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
          className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3 animate-fade-in"
        >
          Welcome to TracerPro, {userName.split(" ")[0]}!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg"
        >
          To get started, create a new workspace or join an existing one matching your email domain <span className="font-semibold text-slate-800">@{emailDomain}</span>.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Card 1: Create Organization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col backdrop-blur-sm bg-white/70">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <Plus className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Create a new workspace</CardTitle>
              <CardDescription>Establish a fresh secure workspace environment for your assets, projects, and activities.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="org-name" className="text-slate-700 font-medium">Workspace Name</Label>
                  <Input
                    id="org-name"
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value);
                      setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }}
                    required
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="org-slug" className="text-slate-700 font-medium">Workspace Slug (URL-friendly)</Label>
                  <div className="relative">
                    <Input
                      id="org-slug"
                      placeholder="acme-corp"
                      value={orgSlug}
                      onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className="h-10 pr-20 border-slate-200"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 select-none">
                      optional
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isCreating} 
                  className="w-full h-11 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6 cursor-pointer"
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
          <Card className="h-full border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col backdrop-blur-sm bg-white/70">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Join existing workspace</CardTitle>
              <CardDescription>Discover workspaces registered under your email domain context.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-start">
              {isLoadingOrgs ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary animate-pulse" />
                  <span className="text-sm">Searching matching domains...</span>
                </div>
              ) : isPublicDomain ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-800 space-y-2">
                  <p className="font-semibold">Public Domains Disabled</p>
                  <p className="text-amber-700/90 leading-relaxed">
                    You registered with a public email provider (<span className="font-semibold">{emailDomain}</span>). Auto-joining workspaces via public email domains is disabled to ensure organizational security. Please create a new workspace.
                  </p>
                </div>
              ) : suggestedOrgs.length === 0 ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-500 space-y-2 my-auto">
                  <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-800">No matching workspaces found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    We couldn't find any existing TracerPro workspaces matching the email domain <span className="font-semibold text-slate-600">@{emailDomain}</span>. You can create a new workspace using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-2">
                    Available Workspaces ({suggestedOrgs.length})
                  </p>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {suggestedOrgs.map((org) => (
                      <div 
                        key={org.id} 
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm uppercase">
                            {org.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm group-hover:text-slate-900 transition-colors">{org.name}</p>
                            <p className="text-xs text-slate-400">
                              {org.pivot?.role === "owner" ? "Owned" : "Workspace"} • domain matching
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={isJoining !== null}
                          onClick={() => handleJoin(org.id)}
                          className="h-8 text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 cursor-pointer"
                        >
                          {isJoining === org.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>Join</>
                          )}
                        </Button>
                      </div>
                    ))}
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
        className="mt-12 text-slate-400 text-sm flex items-center gap-3"
      >
        <span>Logged in as <span className="font-semibold text-slate-600">{userEmail}</span></span>
        <span className="text-slate-300">|</span>
        <button 
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-500 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </motion.div>
    </div>
  );
}
