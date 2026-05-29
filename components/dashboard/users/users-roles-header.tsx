"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// import { useState } from "react";

export function UsersRolesHeader() {
  //   const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="space-y-6 mb-8 p-8">
      {/* PAGE HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-wider">
            Users &amp; Roles
          </h1>

          <p className="text-muted-foreground">
            Manage system-wide permissions, assign team members to specific
            roles, and track access logs across the TracerPro ecosystem.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            className="gap-2 text-white"
            // onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      {/* <AddAssetDialog open={openCreate} onOpenChange={setOpenCreate} /> */}
    </div>
  );
}
