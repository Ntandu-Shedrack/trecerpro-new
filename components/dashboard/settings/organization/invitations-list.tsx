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
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Trash2, Search, UserPlus } from "lucide-react";
import { InviteMemberDialog } from "./invite-member-dialog";
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
  const [search, setSearch] = useState("");
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

  const filteredInvitations = invitations.filter((invite) =>
    invite.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invitations by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {canManage && (
          <InviteMemberDialog
            organizationId={organizationId}
            onInvited={onChanged}
          >
            <Button className="gap-2 shadow-sm w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </InviteMemberDialog>
        )}
      </div>

      {filteredInvitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">No invitations match your search criteria.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Sent</TableHead>
                {canManage && <TableHead className="w-16" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvitations.map((invite) => {
                const isPending = invite.status === "pending";
                const isAccepted = invite.status === "accepted";
                const isExpired = invite.status === "expired";

                return (
                  <TableRow key={invite.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{invite.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {invite.role === "admin" ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10 font-semibold capitalize py-1">
                          {invite.role}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="capitalize font-medium py-1 text-muted-foreground border-muted-foreground/20">
                          {invite.role}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {isPending ? (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10 capitalize font-medium py-1">
                          {invite.status}
                        </Badge>
                      ) : isAccepted ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10 capitalize font-medium py-1">
                          {invite.status}
                        </Badge>
                      ) : isExpired ? (
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10 capitalize font-medium py-1">
                          {invite.status}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="capitalize">
                          {invite.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {invite.created_at
                        ? format(new Date(invite.created_at), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    {canManage && (
                      <TableCell className="py-4 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted"
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
                                Are you sure you want to revoke the invite link for <strong>{invite.email}</strong>? The invitation link will immediately expire and no longer function.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevoke(invite)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Revoke Invitation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
