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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { MoreVertical, UserX, Shield, Loader2, Search, Crown } from "lucide-react";
import type { OrgMember } from "@/types";
import { useUser } from "@/context/auth-context";
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
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
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

  // Filter members based on search and role
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">No members match your search criteria.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Member</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                {canManage && <TableHead className="w-16" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const isMe = user?.primaryEmailAddress?.emailAddress.toLowerCase() === member.email.toLowerCase();
                const isOwner = member.role === "owner";
                // Only allow managing if current user has permission, target is not the owner, and target is not current user themselves
                const showActions = canManage && !isOwner && !isMe;

                return (
                  <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={member.imageUrl} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                            {member.name?.[0]?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            {member.name}
                            {isMe && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-semibold bg-primary/10 text-primary hover:bg-primary/10">
                                You
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {isOwner ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10 font-semibold gap-1 capitalize py-1">
                          <Crown className="h-3 w-3" />
                          {member.role}
                        </Badge>
                      ) : member.role === "admin" ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10 font-semibold capitalize py-1">
                          {member.role}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="capitalize font-medium py-1 text-muted-foreground border-muted-foreground/20">
                          {member.role}
                        </Badge>
                      )}
                    </TableCell>
                    {canManage && (
                      <TableCell className="py-4 text-right">
                        {showActions ? (
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setActiveMember(member);
                                    setSelectedRole(
                                      member.role === "admin"
                                        ? "org:admin"
                                        : "org:member"
                                    );
                                    setRoleOpen(true);
                                  }}
                                >
                                  <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                                  Change role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
                                        Are you sure you want to remove <strong>{member.name}</strong>? They will immediately lose access to this organization and all its projects.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRemove(member)}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                      >
                                        Remove Member
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {loadingId === String(member.id) && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        ) : (
                          // If actions are disabled (because it's the owner or themselves)
                          <div className="h-8 w-8" />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Change Role Dialog */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change role for {activeMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            {[
              { role: "org:member", label: "Member" },
              { role: "org:admin", label: "Admin" },
            ].map((r) => (
              <Button
                key={r.role}
                type="button"
                variant={selectedRole === r.role ? "default" : "outline"}
                onClick={() => setSelectedRole(r.role)}
                className="py-6 text-sm font-semibold"
              >
                {r.label}
              </Button>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleSave} className="gap-2">
              {loadingId === String(activeMember?.id) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
