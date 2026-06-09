"use client";

import * as React from "react";
import { Plus, FolderPlus, HelpCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { createProject } from "@/actions/project.actions";

const formSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(255, "Project name must not exceed 255 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "on-hold", "completed"]),
});

interface ProjectCreateDialogProps {
  organizationId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ProjectCreateDialog({
  organizationId,
  trigger,
  onSuccess,
}: ProjectCreateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organizationId) {
      toast.error("No active organization found");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createProject({
        name: values.name,
        description: values.description,
        status: values.status,
        organizationId,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Project created successfully");
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 gap-1.5 transition-all duration-200 hover:bg-muted border-border text-foreground hover:text-foreground">
            <Plus className="h-4 w-4 text-primary" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[500px] border-border/60 bg-card text-foreground p-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">Create Project</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">
                Initialize a new project workspace. Define your asset monitoring scopes.
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
                      placeholder="E.g. Security Audit 2026"
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
                      placeholder="Define the scope, objectives, or physical locations..."
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
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-[11px] uppercase">Initial Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                onClick={() => setOpen(false)}
                className="px-6 mr-auto font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-xl h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-10 h-11 font-black tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 border-none rounded-xl"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
