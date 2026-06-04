"use client";

import * as React from "react";
import { 
  Folder, 
  Clock, 
  ChevronRight,
  Share2,
  Edit2,
  Info} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { type Project } from "@/types";
import type { Activity, AssetWithCategory, Category } from "@/types";
import OverviewTab from "./overview-tab";
import SettingsTab from "./settings-tab";
import { ProjectEditDialog } from "./project-edit-dialog";
import AssetsTab from "./assets-tab";
import ActivityTab from "./activity-tab";

interface ProjectDetailsViewProps {
  project: Project;
  stats: {
    assetCount: number;
    categoryCount: number;
  };
  initialAssets?: AssetWithCategory[];
  initialAssetsCount?: number;
  initialCategories?: Category[];
  initialActivities?: Activity[];
  initialActivitiesTotalPages?: number;
}

export default function ProjectDetailsView({
  project,
  stats,
  initialAssets = [],
  initialAssetsCount = 0,
  initialCategories = [],
  initialActivities = [],
  initialActivitiesTotalPages = 1,
}: ProjectDetailsViewProps) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);


  const statusConfig = {
    active: {
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" />,
      label: "Active"
    },
    completed: {
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />,
      label: "Completed"
    },
    "on-hold": {
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" />,
      label: "On Hold"
    },
    draft: {
      color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-slate-500 mr-2" />,
      label: "Draft"
    },
    suspended: {
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-rose-500 mr-2" />,
      label: "Suspended"
    },
    archived: {
      color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-zinc-500 mr-2" />,
      label: "Archived"
    }
  };

  const currentStatus = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <div className="flex flex-col gap-8 p-1 sm:p-4 text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-sm">
              <Folder className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight">{project.name}</h1>
                <Badge variant="outline" className={`flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${currentStatus.color}`}>
                  {currentStatus.icon}
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 text-sm max-w-xl line-clamp-1">
                <Info className="h-3.5 w-3.5" />
                {project.description || "Project created recently. No description added yet."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2 flex-1 md:flex-none">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              size="sm" 
              className="gap-2 flex-1 md:flex-none shadow-md"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit2 className="h-4 w-4" />
              Edit Details
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 border border-border/50">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md">
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4" />
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Archive Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="w-full space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-px">
          <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none">
            {["overview", "assets", "activity", "settings"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="relative px-3 py-3 rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary transition-all capitalize font-medium text-muted-foreground data-[state=active]:text-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 hidden sm:flex">
             <Clock className="h-3.5 w-3.5" />
             Last activity updated {format(new Date(project.updated_at), "MMM d, HH:mm")}
          </div>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <TabsContent value="overview" className="m-0 space-y-6">
                <OverviewTab project={project} stats={stats} />
              </TabsContent>

              <TabsContent value="assets" className="m-0 border-none p-0">
                <AssetsTab
                  projectId={String(project.id)}
                  initialAssets={initialAssets}
                  initialCount={initialAssetsCount}
                  initialCategories={initialCategories}
                />
              </TabsContent>

              <TabsContent value="activity" className="m-0 border-none p-0">
                <ActivityTab
                  projectId={String(project.id)}
                  initialActivities={initialActivities}
                  initialTotalPages={initialActivitiesTotalPages}
                />
              </TabsContent>

              <TabsContent value="settings" className="m-0 h-auto flex flex-col gap-6">
                <SettingsTab projectId={String(project.id)} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <ProjectEditDialog 
        project={project} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </div>
  );
}

