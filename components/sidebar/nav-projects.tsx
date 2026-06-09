"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MoreHorizontal,
  Folder,
  Share,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getProjects, deleteProject } from "@/actions/project.actions";
import type { Project } from "@/types";
import { ProjectCreateDialog } from "../dashboard/project/project-create-dialog";

function getRouteMatch(pathname: string, url: string) {
  if (!url || url === "#") {
    return { isActive: false };
  }

  return {
    isActive: pathname === url || pathname.startsWith(url + "/"),
  };
}

export function NavProjects({
  organizationId,
}: {
  organizationId?: string;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchProjects = React.useCallback(async () => {
    if (!organizationId) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await getProjects(organizationId);
      if (error) {
        toast.error("Failed to load projects");
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await deleteProject(String(projectToDelete.id));
      if (error) {
        toast.error(error);
      } else {
        toast.success("Project deleted");
        fetchProjects();
      }
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between pr-2">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          {organizationId && (
            <ProjectCreateDialog
              organizationId={organizationId}
              onSuccess={fetchProjects}
              trigger={
                <button className="p-1 hover:bg-muted rounded-md transition-colors">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              }
            />
          )}
        </div>

        <SidebarMenu>
          {isLoading ? (
            <div className="space-y-2 px-2 py-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                  <Skeleton className="h-4 w-4 shrink-0 rounded-md" />
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-2 space-y-2">
              <p className="text-xs text-muted-foreground">No projects found</p>
              {organizationId && (
                <ProjectCreateDialog
                  organizationId={organizationId}
                  onSuccess={fetchProjects}
                  trigger={
                    <Button variant="outline" size="sm" className="w-full h-7 text-[10px] gap-1">
                      <Plus className="h-3 w-3" />
                      Add your first project
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = `/dashboard/projects/${item.id}`;
              const match = getRouteMatch(pathname, projectUrl);

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={match.isActive}>
                    <Link href={projectUrl}>
                      <Folder className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-48 bg-background"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem asChild className="text-foreground">
                        <Link href={projectUrl}>
                          <Folder className="h-4 w-4 mr-2" />
                          View Project
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-foreground">
                        <Share className="h-4 w-4 mr-2" />
                        Share Project
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setProjectToDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroup>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              <span className="font-semibold text-foreground"> "{projectToDelete?.name}"</span> and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
