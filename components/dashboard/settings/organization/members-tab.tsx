"use client";

import { useCurrentOrganization, useSession } from "@/context/auth-context";
import { MembersList } from "./members-list";
import { InvitationsList } from "./invitations-list";
import { InviteMemberDialog } from "./invite-member-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useState } from "react";
import {
  getOrganizationInvitations,
  getOrganizationMembers,
} from "@/actions/organization.actions";
import type { OrgInvitation, OrgMember } from "@/types";

export default function MembersTab() {
  const { organization, isLoaded } = useCurrentOrganization();
  const { hasPermission } = useSession();
  const canManage = hasPermission("org:sys_memberships:manage");

  const [members, setMembers] = useState<OrgMember[]>([]);
  const [invitations, setInvitations] = useState<OrgInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!organization?.id) return;
    setLoading(true);
    const [membersRes, invitationsRes] = await Promise.all([
      getOrganizationMembers(organization.id),
      getOrganizationInvitations(organization.id),
    ]);
    setMembers(membersRes.data ?? []);
    setInvitations(invitationsRes.data ?? []);
    setLoading(false);
  }, [organization]);

  useEffect(() => {
    if (isLoaded && organization?.id) {
      void loadData();
    }
  }, [isLoaded, organization, loadData]);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!organization) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage access, roles, and invitations for{" "}
            <span className="font-medium text-foreground">{organization.name}</span>
          </p>
        </div>
        {canManage && (
          <InviteMemberDialog
            organizationId={organization.id}
            onInvited={loadData}
          >
            <Button className="gap-2 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </InviteMemberDialog>
        )}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="w-fit bg-transparent border-b rounded-none h-auto p-0 gap-8">
          <TabsTrigger
            value="members"
            className="group relative px-2 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
          >
            Members
            <Badge
              variant="secondary"
              className="ml-2 text-xs group-data-[state=active]:bg-primary/10"
            >
              {members.length}
            </Badge>
            <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-primary transition-transform duration-200 group-data-[state=active]:scale-x-100" />
          </TabsTrigger>
          <TabsTrigger
            value="invitations"
            className="group relative px-2 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
          >
            Invitations
            <Badge variant="secondary" className="ml-2 text-xs">
              {invitations.length}
            </Badge>
            <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-primary transition-transform duration-200 group-data-[state=active]:scale-x-100" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No members yet</p>
              {canManage && (
                <InviteMemberDialog
                  organizationId={organization.id}
                  onInvited={loadData}
                >
                  <Button variant="outline" className="mt-4">
                    Invite your first member
                  </Button>
                </InviteMemberDialog>
              )}
            </div>
          ) : (
            <MembersList
              organizationId={organization.id}
              members={members}
              canManage={canManage}
              onChanged={loadData}
            />
          )}
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          {invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </div>
          ) : (
            <InvitationsList
              organizationId={organization.id}
              invitations={invitations}
              canManage={canManage}
              onChanged={loadData}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
