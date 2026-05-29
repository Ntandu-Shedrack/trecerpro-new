"use client";

import { Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsHeader() {
  return (
    <div className="space-y-6 mb-8 p-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl font-black tracking-tight">
            Project Management Workspace
          </h1>

          <p className="text-slate-400 text-base max-w-2xl">
            Efficiently oversee enterprise asset verification lifecycle. Monitor
            progress across global locations in real-time.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl w-fit">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="size-4" />
                Filter
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="size-4" />
                Sort by: Recent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
