"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Box,
  Layers,
  Info,
  Upload,
  X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

import { getAssets, deleteAsset } from "@/actions/asset.actions";
import { getCategories } from "@/actions/category.actions";
import type { AssetWithCategory, Category } from "@/types";
import AssetDialog from "./asset-dialog";
import BulkUploadDialog from "./bulk-upload-dialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const getAssetStatusConfig = (values: Record<string, unknown> = {}) => {
  const statusKey = Object.keys(values || {}).find((k) => /status|state/i.test(k));
  const statusVal = statusKey ? String(values[statusKey]).trim() : "RUNNING";
  const statusUpper = statusVal.toUpperCase();

  let dotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
  let textColor = "text-emerald-500";

  if (/stop|inactive|offline|broken|critical|fail/i.test(statusVal)) {
    dotColor = "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    textColor = "text-rose-500";
  } else if (/maintain|pend|warn|pause/i.test(statusVal)) {
    dotColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
    textColor = "text-amber-500";
  }

  return {
    label: statusUpper,
    dotColor,
    textColor,
  };
};

interface AssetsTabProps {
  projectId: string;
  initialAssets?: AssetWithCategory[];
  initialCategories?: Category[];
}

export default function AssetsTab({
  projectId,
  initialAssets = [],
  initialCategories = [],
}: AssetsTabProps) {
  const [assets, setAssets] = React.useState<AssetWithCategory[]>(initialAssets);
  const [categories, setCategories] = React.useState<Category[]>(
    Array.isArray(initialCategories) ? initialCategories : ((initialCategories as unknown as { data?: Category[] })?.data || [])
  );
  const [loading, setLoading] = React.useState(initialAssets.length === 0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<AssetWithCategory | null>(null);
  const [deletingAssetId, setDeletingAssetId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const limit = 10;

  // Filter assets client-side based on search query
  const filteredAssets = React.useMemo(() => {
    if (!search) return assets;
    const searchLower = search.toLowerCase();
    return assets.filter((asset) => {
      const barcodeMatch = asset.barcode?.toLowerCase().includes(searchLower);
      const categoryMatch = asset.category?.name?.toLowerCase().includes(searchLower);
      const valuesMatch = Object.values(asset.values || {}).some((val) =>
        String(val).toLowerCase().includes(searchLower)
      );
      return barcodeMatch || categoryMatch || valuesMatch;
    });
  }, [assets, search]);

  const totalCount = filteredAssets.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Paginated assets to display in current view
  const paginatedAssets = React.useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredAssets.slice(startIndex, startIndex + limit);
  }, [filteredAssets, page, limit]);

  // Adjust page number if it exceeds totalPages
  React.useEffect(() => {
    if (page > 1 && page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  const fetchAssets = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getAssets(projectId);
      if (error) {
        toast.error(error);
      } else {
        setAssets(data);
      }
    } catch {
      toast.error("Failed to fetch assets");
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [projectId]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const { data, error } = await getCategories(projectId);
      if (error) {
        toast.error(error);
      } else {
        const list = Array.isArray(data) ? data : ((data as unknown as { data?: Category[] })?.data || []);
        setCategories(list);
      }
    } catch {
      toast.error("Failed to fetch categories");
    }
  }, [projectId]);

  React.useEffect(() => {
    if (initialAssets.length > 0) {
      setLoading(false);
      return;
    }
    fetchAssets();
  }, [fetchAssets, initialAssets.length]);

  React.useEffect(() => {
    if (initialCategories.length > 0) return;
    fetchCategories();
  }, [fetchCategories, initialCategories.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deletingAssetId) return;
    setIsDeleting(true);
    try {
      const { error } = await deleteAsset(deletingAssetId, projectId);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Asset deleted successfully");
        fetchAssets();
        setDeletingAssetId(null);
      }
    } catch {
      toast.error("An error occurred while deleting the asset");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search assets..."
              className="pl-9 h-10 bg-muted/30 border-border/85 focus:border-border text-foreground placeholder:text-muted-foreground/80 focus:bg-card transition-all shadow-inner rounded-lg"
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {search && !loading && (
            <p className="text-xs text-muted-foreground animate-in fade-in zoom-in duration-300">
              Found <span className="font-semibold text-foreground">{totalCount}</span> {totalCount === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsBulkDialogOpen(true)}
            className="w-full sm:w-auto gap-2 shadow-sm border-border/80 bg-transparent hover:bg-muted/35 text-foreground transition-all active:scale-95 rounded-lg cursor-pointer"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => {
              setEditingAsset(null);
              setIsDialogOpen(true);
            }}
            className="w-full sm:w-auto gap-2 shadow-lg bg-primary hover:bg-primary/95 text-primary-foreground transition-all group active:scale-95 rounded-lg border-none cursor-pointer"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 text-primary-foreground" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/75 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-transparent border-b border-border/80">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="w-[350px] font-bold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">Asset Details</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">Category</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">Status & Date</TableHead>
              <TableHead className="text-right font-bold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-full bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded float-right" /></TableCell>
                </TableRow>
              ))
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center gap-6 py-8">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-muted border border-border flex items-center justify-center animate-pulse">
                        <div className="h-16 w-16 rounded-full bg-card flex items-center justify-center">
                          <Box className="h-8 w-8 text-muted-foreground/60" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-card border border-border/80 flex items-center justify-center shadow-lg">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-foreground">No assets found</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        {search
                          ? `We couldn't find any assets matching "${search}". Try adjusting your filters.`
                          : "Your inventory is currently empty. Start by cataloging your first asset to track it."}
                      </p>
                    </div>
                    {!search && (
                      <Button
                        variant="secondary"
                        onClick={() => setIsDialogOpen(true)}
                        className="mt-2 gap-2 border border-border/80 text-foreground bg-muted hover:bg-muted/80 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Asset
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedAssets.map((asset, index) => {
                  const statusCfg = getAssetStatusConfig(asset.values);
                  return (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group hover:bg-muted/30 transition-all border-b border-border/40"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-muted border border-border/80 flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform duration-300">
                            <Layers className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-base leading-none">
                                {asset.barcode}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-card border-border p-3 max-w-xs text-foreground shadow-2xl">
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Specifications</p>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {Object.entries(asset.values).slice(0, 4).map(([key, value]) => (
                                          <div key={key} className="flex flex-col">
                                            <span className="text-[9px] text-muted-foreground uppercase">{key}</span>
                                            <span className="text-xs font-semibold text-foreground">{String(value)}</span>
                                          </div>
                                        ))}
                                        {Object.keys(asset.values).length === 0 && (
                                          <p className="text-xs text-muted-foreground italic col-span-2 text-center py-2">No custom attributes</p>
                                        )}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline" className="bg-transparent hover:bg-muted/10 border border-primary/20 text-primary transition-all font-semibold px-3 py-1 text-[10px] uppercase tracking-wider gap-1.5 shadow-sm rounded-full w-fit">
                          <Tag className="h-3 w-3 text-primary/70" />
                          {asset.category?.name || "Global"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col gap-1.5 text-foreground">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(asset.created_at), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotColor}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${statusCfg.textColor}`}>{statusCfg.label}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-200">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-105 active:scale-95 shadow-sm text-muted-foreground transition-all duration-200 cursor-pointer"
                                  onClick={() => {
                                    setEditingAsset(asset);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-card border-border text-foreground text-[10px] font-bold uppercase tracking-wider py-1.5 px-2.5 shadow-xl">
                                Edit details
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
                                  onClick={() => setDeletingAssetId(String(asset.id))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-card border-border text-destructive text-[10px] font-bold uppercase tracking-wider py-1.5 px-2.5 shadow-xl">
                                Remove Asset
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/10 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
              Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)} of {totalCount} assets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
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
                      className={`h-9 w-9 text-xs font-bold transition-all border shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${page === p
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
                className="h-9 px-3 text-xs font-bold gap-2 bg-background/50 hover:bg-background border-border/60 transition-all border shadow-sm cursor-pointer disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingAssetId} onOpenChange={(open) => !open && setDeletingAssetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Asset permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{assets.find(a => a.id === deletingAssetId)?.barcode || "this asset"}</strong>. This action{" "}
              <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-border/50">Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2 cursor-pointer"
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

      <AssetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectId={projectId}
        categories={categories}
        editingAsset={editingAsset}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchAssets();
        }}
      />

      <BulkUploadDialog
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
        projectId={projectId}
        categories={categories}
        onSuccess={() => {
          setIsBulkDialogOpen(false);
          fetchAssets();
        }}
      />
    </div>
  );
}