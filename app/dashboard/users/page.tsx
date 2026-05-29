"use client";

import { UsersRolesHeader } from "@/components/dashboard/users/users-roles-header";
import UserStats from "@/components/dashboard/users/users-roles-stats";
import UsersTable from "@/components/dashboard/users/users-table";

export default function UsersAndRoles() {
  return (
    <>
      <UsersRolesHeader />
      <UserStats />
      <UsersTable />
    </>
  );
}
