"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { X, ArrowRight, Plus } from "lucide-react";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/40 backdrop-blur-xs" />
      <DialogContent className="p-0 gap-0 max-w-[650px] bg-[#161f2a] border-slate-800">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-800 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold">
              Create New Project
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-400">
              Set up a new project workspace to manage assets, teams, and
              verification workflows.
            </DialogDescription>
          </div>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button> */}
        </DialogHeader>

        {/* Form Body */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[65vh]">
          {/* Project Name */}
          <div className="space-y-2">
            <Label>
              Project Name <span className="text-red-500">*</span>
            </Label>

            <Input
              placeholder="e.g. Security Audit 2026"
              className="bg-slate-900/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              rows={3}
              placeholder="Briefly describe the purpose of this project..."
              className="bg-slate-900/50 resize-none"
            />
          </div>

          {/* Status + Asset Scope */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Status</Label>

              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="hold">On Hold</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Assets</Label>

              <Input
                type="number"
                placeholder="0"
                className="bg-slate-900/50"
              />

              <p className="text-[11px] text-slate-500">
                Approximate count for resource allocation.
              </p>
            </div>
          </div>

          {/* Project Owner */}
          <div className="space-y-2">
            <Label>Project Owner</Label>

            <div className="flex items-center gap-3 p-3 bg-slate-900/50 border rounded-lg hover:bg-slate-900 cursor-pointer">
              <div className="size-8 rounded-full overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZWG4GIIGEwz4s0PqCHOO1Ui-9VlLPE4Sf2CvoO8RGwKmIVsynIu4p9z67XKW3taCJnGqy5-IhRJOTOFpKGPkDf37_dOhGzzdUB9M_0tPSin3fStdpMWokP8XBLXTqRY4NF66V62SYxuiFMX0v53RGj_WE6hy9UaaMMwUGW0evcLElITY3a2-boXJJ9JH_sXebhgkpjp6HP5_U26YBg4xOwxvjNp1HFZbJjFTgOMhf140uqBHykqDgqjunWMWNk37bIEDW7TRfPiw"
                  alt="Owner"
                  width={32}
                  height={32}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">Sarah Jenkins (You)</p>

                <p className="text-xs text-slate-500">
                  Lead Security Architect
                </p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label>Team Members</Label>

            <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 border rounded-lg min-h-[44px]">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 border text-xs">
                Alex Rivera
              </div>

              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 border text-xs">
                Jordan Smith
              </div>

              <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-dashed text-xs hover:text-primary">
                <Plus className="size-3" />
                Add Member
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0d141b] border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <span className="text-sm text-slate-500">Notify team members</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button className="flex text-white items-center gap-2">
              Create Project
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
