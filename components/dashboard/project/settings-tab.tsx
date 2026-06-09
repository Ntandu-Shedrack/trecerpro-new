"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Trash2,
  Edit2,
  Layers,
  Info,
  Settings2,
  Table as TableIcon,
  Loader2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { getCategories, deleteCategory } from "@/actions/category.actions";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import CategoryDialog from "./category-dialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


interface SettingsTabProps {
  projectId: string;
  initialCategories?: Category[];
}

export default function SettingsTab({ projectId, initialCategories = [] }: SettingsTabProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(initialCategories.length === 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 10;
  const totalCount = categories.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Paginated categories list
  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return categories.slice(startIndex, startIndex + limit);
  }, [categories, page, limit]);

  // Adjust page number if it exceeds totalPages
  useEffect(() => {
    if (page > 1 && page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);


  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getCategories(projectId);
      if (error) throw new Error(error);
      const list = Array.isArray(data) ? data : ((data as unknown as { data?: Category[] })?.data || []);
      setCategories(list);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const handleDelete = async () => {
    if (!deletingCategoryId) return;
    setIsDeleting(true);
    try {
      const { error } = await deleteCategory(deletingCategoryId, projectId);
      if (error) throw new Error(error);
      toast.success("Category deleted successfully");
      fetchCategories();
      setDeletingCategoryId(null);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };


  return (
    <div className="space-y-8 mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Categories</h2>
          <p className="text-muted-foreground text-sm">
            Define different asset categories and their custom attributes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
          className="gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[300px] font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Category Name</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Description</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Attributes</TableHead>
              <TableHead className="text-right font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-full bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded float-right" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Layers className="h-8 w-8 text-primary/40" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shadow-lg">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-foreground/90">No categories found</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Your project currently has no categories. Start by defining your first category to organize your assets.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingCategory(null);
                        setIsDialogOpen(true);
                      }}
                      className="mt-2 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create First Category
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {Array.isArray(categories) && paginatedCategories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group hover:bg-muted/30 transition-all border-border/40"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <Layers className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-foreground/90 truncate group-hover:text-primary transition-colors text-base leading-none">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.description ? (
                        <span className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 font-medium max-w-xs">
                          {category.description}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40 italic mt-1 font-medium">
                          No description provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {category.attributes.length > 0 ? (
                          <>
                            <Badge variant="secondary" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20">
                              {category.attributes.length} fields
                            </Badge>
                            <div className="flex -space-x-1 overflow-hidden">
                              {category.attributes.slice(0, 3).map((attr, idx) => (
                                <div
                                  key={idx}
                                  className="h-5 px-1.5 text-[9px] flex items-center bg-background border rounded-md shadow-sm"
                                  title={`${attr.name} (${attr.type})`}
                                >
                                  {attr.name}
                                </div>
                              ))}
                              {category.attributes.length > 3 && (
                                <div className="h-5 px-1 bg-muted flex items-center text-[9px] rounded-md border">
                                  +{category.attributes.length - 3}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No fields</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-all duration-200">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-105 active:scale-95 shadow-sm text-muted-foreground transition-all duration-200 cursor-pointer"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-card border-border text-foreground text-[10px] font-bold uppercase tracking-wider py-1.5 px-2.5 shadow-xl">
                              Edit category
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 hover:scale-105 active:scale-95 shadow-sm text-muted-foreground transition-all duration-200 cursor-pointer"
                                onClick={() => setDeletingCategoryId(String(category.id))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-card border-border text-destructive text-[10px] font-bold uppercase tracking-wider py-1.5 px-2.5 shadow-xl">
                              Remove Category
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/10 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
              Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)} of {totalCount} categories
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
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
                      disabled={isLoading}
                    >
                      {p}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingCategoryId} onOpenChange={(open) => !open && setDeletingCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Category permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{categories.find(c => c.id === deletingCategoryId)?.name || "this category"}</strong>. This action{" "}
              <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-border/50">Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, delete forever"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent flex flex-col gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold">What are categories?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Categories help you organize different types of assets like Servers, Software Licenses, or Hardware.
          </p>
        </div>
        <div className="p-5 rounded-2xl border bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Settings2 className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="font-bold">Dynamic Attributes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Assign custom fields to each category to track specific data like IP addresses, expiry dates, or vendor info.
          </p>
        </div>
        <div className="p-5 rounded-2xl border bg-gradient-to-br from-blue-500/5 to-transparent flex flex-col gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <TableIcon className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="font-bold">Better Inventory</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standardizing your assets with categories makes searching, filtering, and reporting much more efficient.
          </p>
        </div>
      </div>

      <CategoryDialog
        projectId={projectId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchCategories();
        }}
      />
    </div>
  );
}