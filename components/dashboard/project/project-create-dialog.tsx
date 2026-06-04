"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { createProject } from "@/actions/project.actions";

const formSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(255, "Project name must not exceed 255 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "suspended", "archived"]),
});

interface ProjectCreateDialogProps {
  organizationId: string;
  trigger?: React.ReactNode;
}

export function ProjectCreateDialog({
  organizationId,
  trigger,
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
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[480px] bg-slate-950 border-l border-slate-800 text-foreground overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-slate-800">
          <SheetTitle className="text-xl font-bold text-white">Create Project</SheetTitle>
          <SheetDescription className="text-slate-400">
            Initialize a new project workspace. Define your asset monitoring scopes.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-bold uppercase tracking-wider text-xs">Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Security Audit 2026" className="bg-slate-900 border-slate-800 focus:bg-slate-950" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-bold uppercase tracking-wider text-xs">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Define the scope, objectives, or physical locations..."
                      className="resize-none h-28 bg-slate-900 border-slate-800 focus:bg-slate-950"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-bold uppercase tracking-wider text-xs">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800 focus:bg-slate-950 capitalize">
                        <SelectValue placeholder="Select a project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-950 border-slate-800 text-foreground">
                      <SelectItem value="active" className="cursor-pointer capitalize">Active</SelectItem>
                      <SelectItem value="draft" className="cursor-pointer capitalize">Draft</SelectItem>
                      <SelectItem value="suspended" className="cursor-pointer capitalize">Suspended</SelectItem>
                      <SelectItem value="archived" className="cursor-pointer capitalize">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-6 border-t border-slate-800">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-primary/20">
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
