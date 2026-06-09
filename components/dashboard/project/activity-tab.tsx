"use client";

import * as React from "react";
import { format } from "date-fns";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Box, 
  Folder, 
  Tag,
  Activity as ActivityIcon,
  Loader2,
  User,
  History,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getProjectActivities } from "@/actions/activity.actions";
import type { Activity } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiffViewer } from "./diff-viewer";

interface ActivityTabProps {
  projectId: string;
  initialActivities?: Activity[];
}

export default function ActivityTab({
  projectId,
  initialActivities = [],
}: ActivityTabProps) {
  const [activities, setActivities] = React.useState<Activity[]>(initialActivities);
  const [loading, setLoading] = React.useState(initialActivities.length === 0);
  const [page, setPage] = React.useState(1);

  const limit = 10;
  const totalCount = activities.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Client-side paginated activities
  const paginatedActivities = React.useMemo(() => {
    const startIndex = (page - 1) * limit;
    return activities.slice(startIndex, startIndex + limit);
  }, [activities, page, limit]);

  // Adjust page number if it exceeds totalPages
  React.useEffect(() => {
    if (page > 1 && page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  const fetchActivities = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await getProjectActivities(projectId);
    
    if (!error && data) {
      setActivities(data);
    }
    setLoading(false);
  }, [projectId]);

  React.useEffect(() => {
    if (initialActivities.length > 0) return;
    fetchActivities();
  }, [fetchActivities, initialActivities.length]);

  const getActionConfig = (action: string) => {
    switch (action) {
      case "created": 
        return { 
          icon: <PlusCircle className="h-4 w-4 text-emerald-500" />, 
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "added new" 
        };
      case "updated": 
        return { 
          icon: <Edit3 className="h-4 w-4 text-blue-500" />, 
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "updated" 
        };
      case "deleted": 
        return { 
          icon: <Trash2 className="h-4 w-4 text-rose-500" />, 
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          text: "removed" 
        };
      default: 
        return { 
          icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />, 
          bg: "bg-muted",
          border: "border-border",
          text: action 
        };
    }
  };

  const getEntityIcon = (entityType: string) => {
    const className = "h-3.5 w-3.5";
    if (entityType === "project") return <Folder className={className} />;
    if (entityType === "category") return <Tag className={className} />;
    if (entityType === "asset") return <Box className={className} />;
    return <ActivityIcon className={className} />;
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex flex-col h-[400px] items-center justify-center rounded-2xl bg-card/30 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40 mb-4" />
        <p className="text-sm text-muted-foreground">Loading activity history...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-[400px] items-center justify-center text-center border rounded-2xl bg-card/30 border-dashed"
      >
        <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
          <History className="h-8 w-8 text-primary/40" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No Activity Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Activities like adding assets, updating categories, and editing project details will appear here.
        </p>
      </motion.div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent"
      >
        <AnimatePresence mode="popLayout">
          {paginatedActivities.map((activity) => {
            const config = getActionConfig(activity.action);
            
            return (
              <motion.div 
                key={activity.id} 
                variants={itemVariants}
                layout
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-background ${config.border} transition-transform duration-300 group-hover:scale-110`}>
                  <div className={`flex items-center justify-center w-full h-full rounded-full ${config.bg}`}>
                    {config.icon}
                  </div>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md hover:bg-card transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" className="w-fit flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-background border shadow-sm text-xs">
                      {getEntityIcon(activity.entity_type)}
                      <span className="capitalize">{activity.entity_type}</span>
                    </Badge>
                    <time className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                      <History className="h-3 w-3" />
                      {format(new Date(activity.created_at), "MMM d, yyyy • HH:mm")}
                    </time>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm leading-relaxed w-full">
                      <div>
                        <span className="font-semibold text-foreground tracking-tight">
                          {activity.user_name || "Unknown User"}
                        </span>{" "}
                        <span className="text-muted-foreground">{config.text}</span>{" "}
                        <span className="font-medium text-foreground">
                          {activity.entity_name || "an item"}
                        </span>
                      </div>
                      {activity.action === "updated" && activity.changes && (
                        <DiffViewer before={activity.changes.before} after={activity.changes.after} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {totalCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40"
        >
          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)} of {totalCount} activities
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (
                  totalPages > 5 &&
                  p !== 1 &&
                  p !== totalPages &&
                  Math.abs(p - page) > 1
                ) {
                  if (p === 2 && page > 3) {
                    return (
                      <span key="ellipsis-start" className="text-muted-foreground px-1.5 text-xs font-bold">
                        ...
                      </span>
                    );
                  }
                  if (p === totalPages - 1 && page < totalPages - 2) {
                    return (
                      <span key="ellipsis-end" className="text-muted-foreground px-1.5 text-xs font-bold">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 text-xs font-bold transition-all border shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${
                      page === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/50 hover:bg-background border-border/60"
                    }`}
                    onClick={() => setPage(p)}
                    disabled={loading}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
