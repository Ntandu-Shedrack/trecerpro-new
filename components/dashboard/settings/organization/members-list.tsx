"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, UserX, Shield, Loader2 } from "lucide-react";
import type { OrgMember } from "@/types";
import {
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "@/actions/organization.actions";

export function MembersList({
  organizationId,
  members,
  canManage,
  onChanged,
}: {
  organizationId: string;
  members: OrgMember[];
  canManage: boolean;
  onChanged: () => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<OrgMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("org:member");

  const handleRemove = async (member: OrgMember) => {
    setLoadingId(String(member.id));
    const { error } = await removeOrganizationMember(
      organizationId,
      String(member.id)
    );
    if (error) toast.error(error);
    else {
      toast.success("Member removed");
      onChanged();
    }
    setLoadingId(null);
  };

  const handleRoleSave = async () => {
    if (!activeMember) return;
    setLoadingId(String(activeMember.id));
    const { error } = await updateOrganizationMemberRole(
      organizationId,
      String(activeMember.id),
      selectedRole
    );
    if (error) toast.error(error);
    else {
      toast.success("Role updated");
      onChanged();
    }
    setRoleOpen(false);
    setLoadingId(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            {canManage && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>{member.name?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setActiveMember(member);
                          setSelectedRole(
                            member.role === "admin" || member.role === "owner"
                              ? "org:admin"
                              : "org:member"
                          );
                          setRoleOpen(true);
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Change role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Remove member
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {member.name} will lose access to this organization.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(member)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {loadingId === String(member.id) && (
                    <Loader2 className="ml-2 inline h-4 w-4 animate-spin" />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            {(["org:member", "org:admin"] as const).map((r) => (
              <Button
                key={r}
                type="button"
                variant={selectedRole === r ? "default" : "outline"}
                onClick={() => setSelectedRole(r)}
              >
                {r === "org:admin" ? "Admin" : "Member"}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
