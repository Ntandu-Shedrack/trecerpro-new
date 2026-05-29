"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Search, MoreVertical } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "offline";
  lastActive: string;
};

const users: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.d@tracerpro.io",
    role: "Administrator",
    status: "active",
    lastActive: "2 mins ago",
  },
  {
    id: "2",
    name: "Alex Smith",
    email: "alex.s@tracerpro.io",
    role: "Asset Manager",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Beth Wilson",
    email: "b.wilson@tracerpro.io",
    role: "Viewer",
    status: "offline",
    lastActive: "3 days ago",
  },
];

export default function UsersTable() {
  return (
    <div className="px-8 py-6">
      <Card className="bg-card border-slate-800 mt-8">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800">
          <CardTitle className="text-base font-semibold">
            All System Users
          </CardTitle>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input placeholder="Search users..." className="pl-9 w-64" />
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            {/* Head */}
            <TableHeader className="bg-slate-900/40">
              <TableRow className="text-xs uppercase tracking-wider text-muted-foreground">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {users.map((user) => {
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">{user.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">{user.role}</TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-400"
                        }
                      >
                        {user.status === "active" ? "Active" : "Offline"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:text-primary">
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            Disable User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
