"use client";

import * as React from "react";
import { useQueryState } from "nuqs";
import { ProjectsGrid } from "./projects-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown, Search } from "lucide-react";
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
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-3xl font-black tracking-tight">
            Project Management Workspace
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            Efficiently oversee enterprise asset verification lifecycle. Monitor progress across global locations in real-time.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-muted/30 border-border/80 text-foreground placeholder:text-muted-foreground/80 focus:bg-card/80 transition-all rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-border/80 text-foreground bg-transparent hover:bg-muted/10">
                <Filter className="size-4 text-muted-foreground" />
                <span>Status: <span className="capitalize text-primary font-bold">{status}</span></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card border-border text-foreground shadow-lg">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
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
              <Button variant="outline" className="flex items-center gap-2 border-border/80 text-foreground bg-transparent hover:bg-muted/10">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <span>Sort: <span className="capitalize text-primary font-bold">{sortBy}</span></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card border-border text-foreground shadow-lg">
              <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
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
