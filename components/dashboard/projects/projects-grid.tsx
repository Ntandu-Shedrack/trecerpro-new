"use client";

import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./create-project-dialog";

type Member = {
  id: string;
  avatar: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "On-Hold";
  progress: number;
  owner: string;
  assets: number;
  members: Member[];
};

interface ProjectsGridProps {
  projects: Project[];
  onCreateProject?: () => void;
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        <AddProjectCard />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusStyles = {
    Active: "bg-emerald-500/10 text-emerald-400",
    Completed: "bg-blue-500/10 text-blue-400",
    "On-Hold": "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="group bg-card border border-slate-800 rounded-xl p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
      {/* Status + Menu */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>

        <button className="text-slate-400 hover:text-slate-200">
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-400">Progress</span>
          <span className="text-xs font-bold">{project.progress}%</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
        {/* Members */}
        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map((member) => (
            <Image
              key={member.id}
              src={member.avatar}
              alt="Team member"
              width={28}
              height={28}
              className="rounded-full border-2 border-slate-900"
            />
          ))}

          {project.members.length > 3 && (
            <div className="size-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
              +{project.members.length - 3}
            </div>
          )}
        </div>

        {/* Owner */}
        <div className="text-right">
          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tight">
            {project.owner}
          </p>

          <p className="text-[11px] text-slate-500">{project.assets} Assets</p>
        </div>
      </div>
    </div>
  );
}

export function AddProjectCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group border-2 border-dashed border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary/40 transition-all min-h-[280px]"
      >
        <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
          <PlusCircle className="size-7" />
        </div>

        <div>
          <p className="font-bold">Add New Project</p>
          <p className="text-xs text-slate-400 mt-1">
            Initialize a new workspace for your team
          </p>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
