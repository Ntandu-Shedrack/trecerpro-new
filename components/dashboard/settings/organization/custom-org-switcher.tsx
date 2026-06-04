"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus, Check, Building2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { useOrganization, useOrganizationList, useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";

export function CustomOrgSwitcher() {
  const { organization } = useOrganization();
  const { createOrganization } = useAuthContext();

  const { userMemberships, setActive, isLoaded } = useOrganizationList();

  if (!isLoaded) return null;

  const memberships = userMemberships?.data || [];

  const handleSwitch = (orgId: string) => {
    setActive({ organization: orgId });
  };

  const handleCreateOrg = async () => {
    const name = prompt("Enter organization name:");
    if (!name) return;

    try {
      await createOrganization(name);
      toast.success("Organization created successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to create organization");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-2 h-auto hover:bg-sidebar-accent"
        >
          <div className="flex items-center gap-2">
            {organization?.imageUrl ? (
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
                {organization?.name || "Select organization"}
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
              onClick={() => handleSwitch(org.id)}
              className="flex items-center justify-between gap-2"
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
          onClick={handleCreateOrg}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
