"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { OrgInvitation } from "@/types";
import { revokeOrganizationInvitation } from "@/actions/organization.actions";

export function InvitationsList({
  organizationId,
  invitations,
  canManage,
  onChanged,
}: {
  organizationId: string;
  invitations: OrgInvitation[];
  canManage: boolean;
  onChanged: () => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRevoke = async (invite: OrgInvitation) => {
    setLoadingId(String(invite.id));
    const { error } = await revokeOrganizationInvitation(
      organizationId,
      String(invite.id)
    );
    if (error) toast.error(error);
    else {
      toast.success("Invitation revoked");
      onChanged();
    }
    setLoadingId(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent</TableHead>
          {canManage && <TableHead className="w-12" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{invite.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {invite.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{invite.status}</Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {invite.created_at
                ? format(new Date(invite.created_at), "MMM d, yyyy")
                : "—"}
            </TableCell>
            {canManage && (
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      disabled={loadingId === String(invite.id)}
                    >
                      {loadingId === String(invite.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke invitation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The invite link for {invite.email} will no longer work.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRevoke(invite)}>
                        Revoke
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
