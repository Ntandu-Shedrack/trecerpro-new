"use client";

import React, { useState, useEffect } from "react";
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/actions/profile.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Laptop, RefreshCw } from "lucide-react";

interface UserSession {
  id: number;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export function SessionsTab() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    const res = await getUserSessions();
    if (res.data) {
      setSessions(res.data);
    }
    setSessionsLoading(false);
  };

  const handleRevokeSession = async (id: number) => {
    const res = await revokeSession(id);
    if (res.success) {
      fetchSessions();
    }
  };

  const handleRevokeAllOthers = async () => {
    const res = await revokeAllOtherSessions();
    if (res.success) {
      fetchSessions();
    }
  };

  const getDeviceIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("iphone") || lowercaseName.includes("android") || lowercaseName.includes("mobile")) {
      return <Smartphone className="h-5 w-5 text-primary" />;
    }
    if (lowercaseName.includes("mac") || lowercaseName.includes("windows") || lowercaseName.includes("linux")) {
      return <Laptop className="h-5 w-5 text-primary" />;
    }
    return <Monitor className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="border border-border bg-card shadow-sm rounded-xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions and logged-in devices associated with your account.</CardDescription>
        </div>
        {sessions.length > 1 && (
          <Button variant="outline" onClick={handleRevokeAllOthers} className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20 font-semibold text-xs">
            Log out other devices
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {sessionsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active sessions found.</p>
        ) : (
          <div className="border border-border rounded-xl divide-y divide-border bg-card overflow-hidden">
            {sessions.map((session, index) => (
              <div key={session.id} className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-muted/5 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-2 rounded-lg border border-primary/10">
                    {getDeviceIcon(session.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-foreground">{session.name || "Unknown Device"}</p>
                      {index === 0 && (
                        <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/10 rounded-full px-2 py-0 font-semibold text-[10px]">
                          Current Session
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started: {new Date(session.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    {session.last_used_at && (
                      <p className="text-xs text-muted-foreground/80 mt-0.5">
                        Last used: {new Date(session.last_used_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-destructive hover:bg-destructive/5 hover:text-destructive font-semibold"
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
