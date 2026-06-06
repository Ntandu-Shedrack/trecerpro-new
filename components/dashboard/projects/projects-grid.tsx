"use client";

import Link from "next/link";
import { MoreHorizontal, PlusCircle, Folder, Calendar } from "lucide-react";
import { ProjectCreateDialog } from "../project/project-create-dialog";
import type { Project } from "@/types";
import { format } from "date-fns";

interface ProjectsGridProps {
  projects: Project[];
  organizationId: string;
}

export function ProjectsGrid({ projects, organizationId }: ProjectsGridProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        <AddProjectCard organizationId={organizationId} />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusStyles: Record<Project["status"], string> = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "on-hold": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    completed: "bg-muted text-muted-foreground border-border/80",
  };

  return (
    <div className="group bg-card/75 border border-border/80 rounded-xl p-5 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)] flex flex-col justify-between min-h-[180px]">
      <div>
        {/* Status + Menu */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              statusStyles[project.status] || statusStyles.active
            }`}
          >
            {project.status}
          </span>

          <button className="text-muted-foreground hover:text-foreground cursor-pointer">
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        {/* Title */}
        <Link href={`/dashboard/projects/${project.id}`}>
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2 text-foreground">
            <Folder className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {project.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
          {format(new Date(project.created_at), "MMM d, yyyy")}
        </span>
        <Link href={`/dashboard/projects/${project.id}`} className="text-primary font-bold hover:underline">
          View details &rarr;
        </Link>
      </div>
    </div>
  );
}

export function AddProjectCard({ organizationId }: { organizationId: string }) {
  return (
    <ProjectCreateDialog
      organizationId={organizationId}
      trigger={
        <div className="group border-2 border-dashed border-border/80 hover:border-primary/40 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all min-h-[180px] bg-card/20 hover:bg-card/40">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
            <PlusCircle className="size-6" />
          </div>

          <div>
            <p className="font-bold text-foreground">Add New Project</p>
            <p className="text-xs text-muted-foreground mt-1">
              Initialize a new workspace for your team
            </p>
          </div>
        </div>
      }
    />
  );
}
