"use client";

import { useCurrentOrganization, useUser } from "@/context/auth-context";
import { Loader2, Trash2, LogOut, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  deleteOrganization,
  leaveOrganization,
} from "@/actions/organization.actions";

export default function DangerZoneTab() {
  const { organization, membership, isLoaded: orgLoaded } =
    useCurrentOrganization();
  const { isLoaded: userLoaded } = useUser();
  const [leavingOrg, setLeavingOrg] = useState(false);
  const [deletingOrg, setDeletingOrg] = useState(false);

  if (!orgLoaded || !userLoaded) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isAdmin = membership?.role === "org:admin";

  const handleLeave = async () => {
    if (!organization) return;
    setLeavingOrg(true);
    const { error } = await leaveOrganization(organization.id);
    if (error) {
      toast.error(error);
      setLeavingOrg(false);
    } else {
      toast.success("You have left the organization.");
      window.location.href = "/dashboard/overview";
    }
  };

  const handleDelete = async () => {
    if (!organization) return;
    setDeletingOrg(true);
    const { error } = await deleteOrganization(organization.id);
    if (error) {
      toast.error(error);
      setDeletingOrg(false);
    } else {
      toast.success("Organization deleted.");
      window.location.href = "/dashboard/overview";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Info</CardTitle>
          <CardDescription>
            Quick reference for your current organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Organization ID", value: organization?.id },
            { label: "Name", value: organization?.name },
            { label: "Slug", value: organization?.slug },
            { label: "Your role", value: isAdmin ? "Admin" : "Member" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium font-mono break-all text-right max-w-[60%]">
                {value ?? "—"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/20 p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Leave organization
              </p>
              <p className="text-xs text-muted-foreground">
                You will lose access to all organization resources.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  disabled={leavingOrg}
                >
                  {leavingOrg ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Leave"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave organization?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will immediately lose access to{" "}
                    <strong>{organization?.name}</strong> and all its resources.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeave}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {isAdmin && (
            <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium flex items-center gap-1.5 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete organization
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete <strong>{organization?.name}</strong> and all
                  data.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deletingOrg}>
                    {deletingOrg ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">
                      Delete organization permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete <strong>{organization?.name}</strong>{" "}
                      and all associated data. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
