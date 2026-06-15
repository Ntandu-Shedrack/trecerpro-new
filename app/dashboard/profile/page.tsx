"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Calendar, RefreshCw } from "lucide-react";
import { GeneralSecurityTab } from "@/components/dashboard/profile/general-security-tab";
import { SessionsTab } from "@/components/dashboard/profile/sesions-tab";
import { DangerZoneTab } from "@/components/dashboard/profile/danger-zone-tab";

export default function ProfilePage() {
  const { user: rawUser, refreshUser, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState("general");

  if (!rawUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = rawUser.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const is2faActive = !!rawUser.two_factor_confirmed_at;

  return (
    <div className="w-full py-4 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">

      {/* Premium Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 transition-all duration-300 hover:shadow-md">

        {/* Subtle decorative background gradient matching primary */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />

        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary ring-4 ring-primary/10 transition-transform duration-300 hover:scale-105">
            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-extrabold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{rawUser.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-none px-3 py-1 font-semibold text-xs rounded-full">
                {rawUser.organizations?.[0]?.pivot?.role || "Member"}
              </Badge>
              {is2faActive && (
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-xs rounded-full flex gap-1 items-center">
                  <Shield className="h-3.5 w-3.5" /> 2FA Secured
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-muted-foreground/70" />
              {rawUser.email}
            </span>
            <span className="hidden sm:inline text-muted-foreground/45">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground/70" />
              Member since {new Date(rawUser.created_at ?? "").toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Styled Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full justify-start border-b border-border bg-transparent p-0 h-auto gap-6 rounded-none">
          <TabsTrigger
            value="general"
            className="px-4 py-1.5 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 font-semibold transition-all duration-200"
          >
            General & Security
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="px-4 py-1.5 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 font-semibold transition-all duration-200"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="px-4 py-1.5 rounded-lg border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent data-[state=active]:text-destructive px-1 font-semibold transition-all duration-200"
          >
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* General & Security Tab */}
        <TabsContent value="general" className="outline-none">
          <GeneralSecurityTab user={rawUser} refreshUser={refreshUser} />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="outline-none">
          <SessionsTab />
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="outline-none">
          <DangerZoneTab logout={logout} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
