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
  const statusStyles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    archived: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="group bg-card border border-slate-800 rounded-xl p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between min-h-[180px]">
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

          <button className="text-slate-400 hover:text-slate-200">
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        {/* Title */}
        <Link href={`/dashboard/projects/${project.id}`}>
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
            <Folder className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
            {project.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(project.created_at), "MMM d, yyyy")}
        </span>
        <Link href={`/dashboard/projects/${project.id}`} className="text-primary font-bold hover:underline">
          View details &arr;
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
        <div className="group border-2 border-dashed border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary/40 transition-all min-h-[180px]">
          <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
            <PlusCircle className="size-6" />
          </div>

          <div>
            <p className="font-bold">Add New Project</p>
            <p className="text-xs text-slate-400 mt-1">
              Initialize a new workspace for your team
            </p>
          </div>
        </div>
      }
    />
  );
}
