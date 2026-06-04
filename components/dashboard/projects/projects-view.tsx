"use client";

import * as React from "react";
import { useQueryState } from "nuqs";
import { ProjectsGrid } from "./projects-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown, PlusCircle, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types";

interface ProjectsViewProps {
  initialProjects: Project[];
  organizationId: string;
}

export function ProjectsView({ initialProjects, organizationId }: ProjectsViewProps) {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const [sortBy, setSortBy] = useQueryState("sortBy", { defaultValue: "recent" });

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return initialProjects
      .filter((project) => {
        const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
          (project.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
        
        const matchesStatus = status === "all" || project.status === status;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        // default recent
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialProjects, search, status, sortBy]);

  return (
    <div className="space-y-6 p-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl font-black tracking-tight">
            Project Management Workspace
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Efficiently oversee enterprise asset verification lifecycle. Monitor progress across global locations in real-time.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-slate-900/50 border-slate-800 focus:bg-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-slate-800">
                <Filter className="size-4 text-slate-400" />
                <span>Status: <span className="capitalize text-primary font-bold">{status}</span></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-950 border-slate-800">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                <DropdownMenuRadioItem value="all" className="cursor-pointer">All Statuses</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active" className="cursor-pointer">Active</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="draft" className="cursor-pointer">Draft</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="suspended" className="cursor-pointer">Suspended</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="archived" className="cursor-pointer">Archived</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-slate-800">
                <ArrowUpDown className="size-4 text-slate-400" />
                <span>Sort: <span className="capitalize text-primary font-bold">{sortBy}</span></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-950 border-slate-800">
              <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="recent" className="cursor-pointer">Most Recent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name" className="cursor-pointer">Alphabetical</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid */}
      <ProjectsGrid projects={filteredProjects} organizationId={organizationId} />
    </div>
  );
}
