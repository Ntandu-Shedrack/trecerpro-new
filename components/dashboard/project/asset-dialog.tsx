"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { createAsset, updateAsset } from "@/actions/asset.actions";
import type { AssetWithCategory, Category, CategoryAttribute } from "@/types";
import { toast } from "sonner";
import { Box, Settings2, Layers, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mapLaravelValidationErrors } from "@/lib/api/client";

interface AssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  categories: Category[];
  editingAsset: AssetWithCategory | null;
  onSuccess: () => void;
}

function buildDynamicSchema(attributes: CategoryAttribute[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  attributes.forEach((attr) => {
    let fieldSchema: z.ZodTypeAny;

    if (attr.type === "number") {
      fieldSchema = z.coerce.number({
        message: `${attr.label || attr.name} must be a number`,
      });
    } else if (attr.type === "boolean") {
      fieldSchema = z.boolean();
    } else {
      fieldSchema = z.string();
    }

    if (attr.required) {
      if (attr.type === "number") {
        fieldSchema = (fieldSchema as z.ZodNumber).min(0.0001, `${attr.label || attr.name} is required`);
      } else if (attr.type === "boolean") {
        fieldSchema = (fieldSchema as z.ZodBoolean);
      } else {
        fieldSchema = (fieldSchema as z.ZodString).min(1, `${attr.label || attr.name} is required`);
      }
    } else {
      if (attr.type === "boolean") {
        fieldSchema = fieldSchema.default(false);
      } else {
        fieldSchema = fieldSchema.optional().nullable().or(z.literal(""));
      }
    }

    shape[attr.name] = fieldSchema;
  });

  return z.object({
    values: z.object(shape),
  });
}

export default function AssetDialog({
  open,
  onOpenChange,
  projectId,
  categories,
  editingAsset,
  onSuccess
}: AssetDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<string>("");

  const safeCategories = React.useMemo<Category[]>(() => {
    return Array.isArray(categories) ? categories : ((categories as any)?.data || []);
  }, [categories]);

  const selectedCategory = React.useMemo(() => {
    return safeCategories.find((c) => c.id === categoryId);
  }, [categoryId, safeCategories]);

  const dynamicSchema = React.useMemo(() => {
    return buildDynamicSchema(selectedCategory?.attributes || []);
  }, [selectedCategory]);

  const form = useForm<any>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      values: {},
    },
  });

  React.useEffect(() => {
    if (editingAsset) {
      setCategoryId(String(editingAsset.category_id));
      form.reset({
        values: {
          ...editingAsset.values,
          barcode: editingAsset.barcode || editingAsset.values?.barcode || "",
        },
      });
    } else {
      setCategoryId("");
      form.reset({
        values: {},
      });
    }
  }, [editingAsset, open, form]);

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    const category = safeCategories.find(c => c.id === newCategoryId);
    const initialValues: Record<string, any> = {};

    category?.attributes.forEach(attr => {
      if (attr.type === "boolean") {
        initialValues[attr.name] = false;
      } else {
        initialValues[attr.name] = "";
      }
    });

    form.setValue("values", initialValues);
  };

  const onSubmit = async (values: any) => {
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    const barcode = values.values.barcode;
    if (!barcode) {
      toast.error("Barcode is required");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        projectId,
        categoryId,
        barcode,
        values: values.values,
      };

      let res;
      if (editingAsset) {
        res = await updateAsset(String(editingAsset.id), formData);
      } else {
        res = await createAsset(formData);
      }

      if (res.error) {
        if (typeof res.error === "string") {
          toast.error(res.error);
        } else {
          const apiError = res.error as { message?: string; errors?: Record<string, string[]> };
          if (apiError.errors) {
            mapLaravelValidationErrors(apiError.errors, form.setError);
          } else {
            toast.error(apiError.message || "An error occurred");
          }
        }
      } else {
        toast.success(editingAsset ? "Asset updated successfully" : "Asset created successfully");
        onSuccess();
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] border-border/60 bg-card/95 backdrop-blur-md text-foreground overflow-hidden flex flex-col p-0 h-[85vh] sm:h-auto sm:max-h-[90vh] shadow-2xl rounded-2xl">
        <div className="p-8 pb-0">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-inner">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  {editingAsset ? "Edit Asset Details" : "Register New Asset"}
                  {!editingAsset && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {editingAsset
                    ? "Update lifecycle information and technical specifications."
                    : "Initialize a new asset catalog entry into your inventory system."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-2 space-y-8">
              
              {/* Category selector row */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="font-black tracking-[0.2em] text-[10px] text-muted-foreground px-2 whitespace-nowrap uppercase">Asset Category</span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[11px] font-bold tracking-wider text-muted-foreground ml-1 uppercase">Asset Classification</Label>
                    <Select value={categoryId} onValueChange={handleCategoryChange} disabled={!!editingAsset}>
                      <SelectTrigger className="bg-muted/30 border-border/80 focus:bg-card focus:ring-2 focus:ring-primary/20 h-12 text-sm font-semibold text-foreground shadow-inner rounded-xl transition-all">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select classification" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-xl">
                        {safeCategories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)} className="cursor-pointer font-medium p-3 text-left rounded-lg m-1">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{category.name}</span>
                              <span className="text-muted-foreground/80 line-clamp-1 text-xs">{category.description || "System standard category"}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedCategory ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-between min-h-[72px] relative overflow-hidden backdrop-blur-xs shadow-inner"
                      >
                        <div className="absolute right-2 -bottom-2 opacity-5">
                          <Layers className="h-16 w-16 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary/80 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          Attributes loaded
                        </span>
                        <span className="text-xl font-black text-primary mt-1">{selectedCategory.attributes.length} fields</span>
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-xl border border-border border-dashed flex flex-col items-center justify-center min-h-[72px] opacity-40 text-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Select a category</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic specifications row */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {selectedCategory ? (
                    <motion.div
                      key={selectedCategory.id}
                      initial={{ opacity: 0, height: 0, y: 15 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 15 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      className="space-y-6 pt-2 pb-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className="h-px flex-1 bg-border/60" />
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 shadow-sm">
                          <Settings2 className="h-3.5 w-3.5 text-primary/70" />
                          <span className="font-black tracking-[0.2em] text-[10px] text-primary/80 whitespace-nowrap uppercase">Technical Specs</span>
                        </div>
                        <div className="h-px flex-1 bg-border/60" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-muted/15 p-6 rounded-2xl border border-border/80 relative overflow-hidden shadow-inner">
                        {selectedCategory.attributes.map((attr, index) => (
                          <FormField
                            key={`${attr.name}-${index}`}
                            control={form.control}
                            name={`values.${attr.name}`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-[11px] font-black tracking-widest text-foreground flex items-center gap-2 uppercase">
                                  {attr.label || attr.name}
                                  {attr.required && <span className="text-destructive animate-pulse">*</span>}
                                </FormLabel>

                                <FormControl>
                                  {attr.type === "select" ? (
                                    <Select
                                      value={field.value || ""}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="h-11 bg-muted/30 border-border/80 focus:bg-card focus:ring-2 focus:ring-primary/20 font-bold text-xs text-foreground rounded-xl transition-all shadow-inner">
                                        <SelectValue placeholder={`Choose ${attr.label || attr.name || "option"}`} />
                                      </SelectTrigger>
                                      <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-xl">
                                        {attr.options?.map((opt, optIndex) => (
                                          <SelectItem key={`${opt}-${optIndex}`} value={opt} className="font-semibold text-xs text-foreground cursor-pointer rounded-lg m-1">
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : attr.type === "boolean" ? (
                                    <div className="flex items-center gap-4 h-11 px-4 bg-muted/20 border border-border/80 rounded-xl cursor-pointer hover:bg-muted/30 transition-all shadow-inner" onClick={() => field.onChange(!field.value)}>
                                      <Switch
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-emerald-500"
                                      />
                                      <span className={`text-xs font-bold transition-all ${field.value ? "text-emerald-500" : "text-muted-foreground"}`}>
                                        {field.value ? "Active / Enabled" : "Disabled"}
                                      </span>
                                    </div>
                                  ) : (
                                    <Input
                                      type={attr.type === "number" ? "number" : attr.type === "date" ? "date" : "text"}
                                      placeholder={`Enter ${(attr.label || attr.name || "value").toLowerCase()}...`}
                                      className="h-11 bg-muted/30 border-border/80 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-bold text-xs text-foreground rounded-xl transition-all shadow-inner"
                                      {...field}
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}

                        {selectedCategory.attributes.length === 0 && (
                          <div className="col-span-2 py-8 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                            <Box className="h-8 w-8 text-muted-foreground" />
                            <p className="text-xs font-bold text-muted-foreground">No specific attributes defined for this category.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="py-16 text-center flex flex-col items-center justify-center space-y-3"
                    >
                      <Layers className="h-10 w-10 text-muted-foreground opacity-45 animate-bounce" />
                      <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Awaiting Classification Selection</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            <div className="p-8 pt-4">
              <DialogFooter className="gap-4 pt-6 border-t border-border/60">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="px-6 mr-auto font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-xl h-11">
                  Close
                </Button>
                <Button type="submit" disabled={loading || !categoryId} className="px-10 h-11 font-black tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 border-none rounded-xl">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-foreground" />
                      Processing...
                    </>
                  ) : (
                    editingAsset ? "Commit Changes" : "Create Asset"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}