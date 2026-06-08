"use client";

import React, { useState } from "react";
import { deleteUserAccount } from "@/actions/profile.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface DangerZoneTabProps {
  logout: () => void;
}

export function DangerZoneTab({ logout }: DangerZoneTabProps) {
  // Delete Account State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Confirmation text must be 'DELETE'.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    const res = await deleteUserAccount(deletePassword);
    if (res.error) {
      setDeleteError(res.error);
      setDeleteLoading(false);
    } else {
      logout();
    }
  };

  return (
    <>
      <Card className="border border-destructive/20 bg-destructive/5 shadow-sm rounded-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">Destructive, permanent settings. Please exercise caution.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border border-destructive/15 p-5 rounded-xl shadow-inner">
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base flex gap-1.5 items-center">
                <Trash2 className="h-4.5 w-4.5 text-destructive" />
                Delete Account
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Permanently remove your profile details, active organization memberships, and delete all associated data.</p>
            </div>
            <Button variant="destructive" onClick={() => { setDeleteError(null); setShowDeleteDialog(true); }} className="font-bold">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Delete Account Gate */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl border border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Permanent Account Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action is permanent and completely irreversible. It deletes all memberships and revokes your tokens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            {deleteError && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm">
                {deleteError}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm-text" className="text-sm">
                To confirm, type <span className="font-bold select-none text-destructive bg-destructive/5 border border-destructive/10 px-1.5 py-0.5 rounded-md text-xs">DELETE</span> below:
              </Label>
              <Input
                id="delete-confirm-text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="focus-visible:ring-destructive focus-visible:border-destructive text-center uppercase tracking-wider font-semibold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delete-account-password">Enter Password</Label>
              <Input
                id="delete-account-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                required
                className="focus-visible:ring-destructive focus-visible:border-destructive"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeletePassword(""); setDeleteConfirmText(""); setDeleteError(null); }} className="font-semibold">
              Cancel
            </AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading} className="font-semibold">
              {deleteLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
