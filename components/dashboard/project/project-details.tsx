"use client";

import * as React from "react";
import {
  Folder,
  Clock,
  Share2,
  Edit2,
  Info
} from "lucide-react";
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

  const statusConfig: Record<
    Project["status"],
    { color: string; icon: React.ReactNode; label: string }
  > = {
    active: {
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse mr-2" />,
      label: "Active"
    },
    "on-hold": {
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400 mr-2" />,
      label: "On Hold"
    },
    completed: {
      color: "bg-muted text-muted-foreground border-border/80",
      icon: <div className="h-2 w-2 rounded-full bg-muted-foreground mr-2" />,
      label: "Completed"
    },
  };

  const currentStatus = statusConfig[project.status] || statusConfig.active;

  return (
    <div className="flex flex-col gap-8 text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
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
                <Info className="h-3.5 w-3.5 text-muted-foreground/80" />
                {project.description || "Project created recently. No description added yet."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2 flex-1 md:flex-none border-border/80 text-foreground bg-transparent hover:bg-muted/10">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              className="gap-2 flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(19,127,236,0.3)] border-none font-medium"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit2 className="h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="w-full space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-px">
          <TabsList className="bg-transparent h-auto p-0 gap-6 rounded-none">
            {["overview", "assets", "activity", "settings"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-4 py-1.5 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:border-primary/20 data-[state=active]:text-primary border border-transparent transition-all capitalize font-medium text-muted-foreground data-[state=active]:shadow-none hover:text-foreground cursor-pointer"
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
                <SettingsTab projectId={String(project.id)} initialCategories={initialCategories} />
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
