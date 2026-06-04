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
import { getProjects, deleteProject } from "@/actions/project.actions";
import type { Project } from "@/types";
import { ProjectCreateDialog } from "./dashboard/project/project-create-dialog";

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

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await deleteProject(projectId);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Project deleted");
        fetchProjects();
      }
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between pr-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        {organizationId && (
          <ProjectCreateDialog 
            organizationId={organizationId} 
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
          <div className="px-4 py-2 text-xs text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="px-4 py-2 space-y-2">
            <p className="text-xs text-muted-foreground">No projects found</p>
            {organizationId && (
              <ProjectCreateDialog 
                organizationId={organizationId} 
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
                      onClick={() => handleDelete(String(item.id))}
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
  );
}

// Helper Button component for the empty state since we are in nav-projects.tsx
function Button({ className, variant, size, children, ...props }: any) {
  const variants: any = {
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes: any = {
    sm: "px-3 py-1 text-xs",
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
