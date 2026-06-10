"use client";

import { useEffect, useState, useTransition } from "react";
import { 
  Plus, 
  Trash2, 
  Info, 
  Hash,
  Calendar,
  Type,
  List,
  ToggleRight,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { createCategory, updateCategory } from "@/actions/category.actions";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Field, 
  FieldContent, 
  FieldLabel, 
  FieldError
} from "@/components/ui/field";

const attributeSchema = z.object({
  label: z.string().min(1, "Field label is required"),
  name: z.string().min(1, "Field key is required"),
  type: z.enum(["string", "number", "boolean", "date", "select"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const TYPE_CONFIG = {
  string: { icon: Type, label: "Text", color: "text-blue-500", bg: "bg-blue-500/10" },
  number: { icon: Hash, label: "Number", color: "text-amber-500", bg: "bg-amber-500/10" },
  boolean: { icon: ToggleRight, label: "Boolean", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  date: { icon: Calendar, label: "Date", color: "text-purple-500", bg: "bg-purple-500/10" },
  select: { icon: List, label: "Select/Enum", color: "text-rose-500", bg: "bg-rose-500/10" },
};

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  attributes: z.array(attributeSchema),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  projectId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editingCategory?: Category | null;
  onSuccess?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "_")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryDialog({ 
  projectId,
  open,
  onOpenChange,
  editingCategory,
  onSuccess
}: CategoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isDialogOpen = open !== undefined ? open : internalOpen;
  const setIsDialogOpen = onOpenChange || setInternalOpen;
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
        attributes: editingCategory.attributes || [],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        attributes: [],
      });
    }
  }, [editingCategory, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    startTransition(async () => {
      try {
        if (editingCategory) {
          const { error } = await updateCategory(String(editingCategory.id), {
            ...values,
            projectId,
          });
          if (error) throw new Error(error);
          toast.success("Category updated successfully");
        } else {
          const { error } = await createCategory({
            ...values,
            projectId,
          });
          if (error) throw new Error(error);
          toast.success("Category created successfully");
        }
        setIsDialogOpen(false);
        onSuccess?.();
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };
    
  const resetForm = () => {
    if (!editingCategory) {
      form.reset({
        name: "",
        description: "",
        attributes: [],
      });
    }
  };

  const handleLabelChange = (index: number, labelVal: string) => {
    form.setValue(`attributes.${index}.label`, labelVal);
    const currentName = form.getValues(`attributes.${index}.name`);
    if (!currentName || currentName === slugify(form.getValues(`attributes.${index}.label`) || "")) {
      form.setValue(`attributes.${index}.name`, slugify(labelVal));
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border/80 text-foreground shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define the properties for this asset category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid gap-6 p-1">
            <div className="bg-muted/10 p-4 rounded-2xl border border-border/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                <Info className="h-3 w-3 text-muted-foreground" />
                Basic Information
              </div>
              <Field>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category Name</FieldLabel>
                <FieldContent>
                  <Input 
                    placeholder="e.g., Servers, Networking, Workstations" 
                    {...form.register("name")} 
                    className={cn("h-10 bg-muted/30 border-border/80 focus:bg-card text-foreground", form.formState.errors.name ? "border-destructive" : "")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (Optional)</FieldLabel>
                <FieldContent>
                  <Textarea 
                    placeholder="What kind of assets belong to this category?" 
                    {...form.register("description")} 
                    className="bg-muted/30 border-border/80 focus:bg-card min-h-[80px] text-foreground resize-none"
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                    Custom Attributes
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold border-border/80 text-foreground">
                      {fields.length}
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">Define custom fields for assets in this category.</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5 h-8 text-xs font-bold border-border/85 hover:border-primary hover:text-primary transition-all bg-muted/30 text-foreground cursor-pointer"
                  onClick={() => append({ label: "", name: "", type: "string", required: false, options: [] })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-3 min-h-[100px]">
                <AnimatePresence initial={false}>
                  {fields.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-12 border border-dashed rounded-2xl bg-muted/10 border-border/80 text-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No custom fields yet</p>
                        <p className="text-xs text-muted-foreground">Add fields like IP Address, Serial Number, etc.</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 text-xs font-bold bg-muted text-foreground border border-border/50 cursor-pointer"
                        onClick={() => append({ label: "", name: "", type: "string", required: false, options: [] })}
                      >
                        Add First Field
                      </Button>
                    </motion.div>
                  ) : (
                    fields.map((field, index) => {
                      const attrType = form.watch(`attributes.${index}.type`);
                      const Config = TYPE_CONFIG[attrType as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.string;
                      const Icon = Config.icon;

                      return (
                        <motion.div 
                          key={field.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="group relative flex flex-col p-4 rounded-2xl border border-border/80 bg-muted/10 hover:border-primary/30 transition-all hover:shadow-md gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 text-muted-foreground cursor-grab active:cursor-grabbing">
                              <GripVertical className="h-4 w-4" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1">
                              {/* Label */}
                              <div className="md:col-span-4">
                                <Input 
                                  placeholder="Field label (e.g. Serial Number)" 
                                  value={form.watch(`attributes.${index}.label`) || ""}
                                  onChange={(e) => handleLabelChange(index, e.target.value)}
                                  className="h-10 bg-muted/30 border-border/80 focus:bg-card text-foreground text-sm font-semibold"
                                />
                              </div>

                              {/* Key (autogenerated slug) */}
                              <div className="md:col-span-3">
                                <Input 
                                  placeholder="Field key (e.g. serial_no)" 
                                  {...form.register(`attributes.${index}.name` as const)}
                                  className="h-10 bg-muted/10 border-border/80 text-xs font-mono text-muted-foreground"
                                />
                              </div>

                              {/* Type Select */}
                              <div className="md:col-span-3">
                                <Select 
                                  defaultValue={field.type}
                                  onValueChange={(value: any) => 
                                    form.setValue(`attributes.${index}.type`, value)
                                  }
                                >
                                  <SelectTrigger className="h-10 bg-muted/30 border-border/80 focus:ring-1 focus:ring-primary shadow-none text-foreground">
                                    <div className="flex items-center gap-2">
                                      <div className={cn("p-1 rounded", Config.bg)}>
                                        <Icon className={cn("h-3.5 w-3.5", Config.color)} />
                                      </div>
                                      <SelectValue placeholder="Type" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent className="bg-card border-border text-foreground">
                                    {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                                      <SelectItem key={key} value={key} className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                          <div className={cn("p-1 rounded shadow-sm border border-border/80", config.bg)}>
                                            <config.icon className={cn("h-3.5 w-3.5", config.color)} />
                                          </div>
                                          <span className="font-medium text-sm text-foreground">{config.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Actions & Required */}
                              <div className="md:col-span-2 flex items-center justify-between md:justify-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Switch 
                                    id={`required-${field.id}`}
                                    checked={form.watch(`attributes.${index}.required`)}
                                    onCheckedChange={(checked) => 
                                      form.setValue(`attributes.${index}.required`, checked)
                                    }
                                    className="scale-90 data-[state=checked]:bg-primary"
                                  />
                                  <Label htmlFor={`required-${field.id}`} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap">
                                    Req
                                  </Label>
                                </div>

                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Options config for select type */}
                          {attrType === "select" && (
                            <div className="pl-9 pr-2 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Dropdown Options (comma-separated list)
                              </Label>
                              <Input
                                placeholder="e.g. Brand New, Repaired, Salvaged, Retired"
                                className="h-10 bg-muted/30 border-border/80 text-xs font-semibold focus:bg-card text-foreground"
                                value={form.watch(`attributes.${index}.options`)?.join(", ") || ""}
                                onChange={(e) => {
                                  const opts = e.target.value
                                    .split(",")
                                    .map(o => o.trim())
                                    .filter(Boolean);
                                  form.setValue(`attributes.${index}.options`, opts);
                                }}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-2 border-t border-border/60 mt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
              className="font-bold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="min-w-[140px] font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/95 border-none cursor-pointer"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full" />
                  Saving...
                </div>
              ) : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}