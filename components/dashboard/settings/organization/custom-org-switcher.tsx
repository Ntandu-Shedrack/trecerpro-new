"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus, Check, Building2, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useOrganization, useOrganizationList, useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";

export function CustomOrgSwitcher() {
  const { organization } = useOrganization();
  const { createOrganization } = useAuthContext();
  const { userMemberships, setActive, isLoaded } = useOrganizationList();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newOrgName, setNewOrgName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);

  if (!isLoaded) return null;

  const memberships = userMemberships?.data || [];

  const handleSwitch = async (orgId: string) => {
    if (isSwitching) return;
    try {
      setIsSwitching(true);
      const promise = setActive({ organization: orgId });
      toast.promise(promise, {
        loading: "Switching organization...",
        success: "Switched organization successfully!",
        error: "Failed to switch organization",
      });
      await promise;
    } catch (e: unknown) {
      console.error("Failed to switch organization:", e);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      setIsSubmitting(true);
      await createOrganization(newOrgName.trim());
      toast.success("Organization created successfully!");
      setNewOrgName("");
      setIsCreateOpen(false);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || "Failed to create organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isSwitching}>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 py-2 h-auto hover:bg-sidebar-accent"
            disabled={isSwitching}
          >
            <div className="flex items-center gap-2">
              {isSwitching ? (
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : organization?.imageUrl ? (
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  width={28}
                  height={28}
                  className="rounded-md"
                />
              ) : (
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              )}

              <div className="flex flex-col text-left">
                <span className="text-sm font-medium leading-none">
                  {isSwitching ? "Switching..." : (organization?.name || "Select organization")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {organization ? "Active organization" : "No organization"}
                </span>
              </div>
            </div>

            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64 rounded-xl text-foreground bg-background">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* ORG LIST */}
          {memberships.map((membership) => {
            const org = membership.organization;
            const isActive = org.id === organization?.id;

            return (
              <DropdownMenuItem
                key={org.id}
                onClick={() => !isSwitching && handleSwitch(org.id)}
                className="flex items-center justify-between gap-2"
                disabled={isSwitching}
              >
                <div className="flex items-center gap-2">
                  {org.imageUrl ? (
                    <Image
                      src={org.imageUrl}
                      alt={org.name}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
                      <Building2 className="h-3 w-3" />
                    </div>
                  )}

                  <span className="text-sm">{org.name}</span>
                </div>

                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          {/* CREATE ORG */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <form onSubmit={handleCreateOrgSubmit}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a new organization to manage your projects and members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="org-name"
              placeholder="e.g. Acme Corp"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              required
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !newOrgName.trim()}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
