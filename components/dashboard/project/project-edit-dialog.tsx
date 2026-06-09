"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { FolderPlus, Settings2, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProject } from "@/actions/project.actions";
import type { Project } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(["active", "on-hold", "completed"]),
});

interface ProjectEditDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
}: ProjectEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
      status: project.status || "active",
    },
  });

  // Update form values when project changes (e.g. if edited elsewhere or just opened)
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: project.name,
        description: project.description || "",
        status: project.status || "active",
      });
    }
  }, [open, project, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const result = await updateProject(String(project.id), {
        name: values.name,
        description: values.description,
        status: values.status,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Project updated successfully");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[500px] border-border/60 bg-card text-foreground p-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">Edit Project</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">
                Update name, description, and status of this project workspace.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6 pb-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. Warehouse Inventory"
                      className="bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-medium text-sm text-foreground rounded-xl transition-all shadow-inner placeholder:text-muted-foreground/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe the project scope..."
                      className="resize-none h-24 bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-medium text-sm text-foreground rounded-xl transition-all shadow-inner placeholder:text-muted-foreground/60"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Project Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-muted/30 border-border/80 focus:bg-card focus:ring-2 focus:ring-primary/20 h-11 text-sm font-semibold text-foreground shadow-inner rounded-xl transition-all capitalize">
                        <SelectValue placeholder="Select a project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-xl">
                      <SelectItem value="active" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-primary/10 focus:text-primary">Active</SelectItem>
                      <SelectItem value="on-hold" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-amber-500/10 focus:text-amber-500">On hold</SelectItem>
                      <SelectItem value="completed" className="cursor-pointer capitalize font-medium p-3 text-left rounded-lg m-1 focus:bg-muted focus:text-foreground">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-4 bg-card p-6 rounded-b-2xl">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="px-6 mr-auto font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-xl h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-10 h-11 font-black tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 border-none rounded-xl"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
