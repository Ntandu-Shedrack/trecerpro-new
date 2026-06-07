"use client";

import * as React from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import type { Category } from "@/types";
import { bulkCreateAssets } from "@/actions/asset.actions";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  categories: Category[];
  onSuccess: () => void;
}

type ParsedAsset = {
  barcode: string;
  values: Record<string, string | number | boolean | null | undefined>;
};

type ValidationError = {
  row: number;
  message: string;
};

export default function BulkUploadDialog({
  open,
  onOpenChange,
  projectId,
  categories,
  onSuccess,
}: BulkUploadDialogProps) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("");
  const [isProcessingFile, setIsProcessingFile] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const [parsedData, setParsedData] = React.useState<ParsedAsset[]>([]);
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const safeCategories = React.useMemo<Category[]>(() => {
    return Array.isArray(categories) ? categories : ((categories as unknown as { data: Category[] })?.data || []);
  }, [categories]);

  const selectedCategory = safeCategories.find((c) => c.id === selectedCategoryId);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedCategoryId("");
      setParsedData([]);
      setErrors([]);
      setFileName(null);
      setIsDragOver(false);
    }
  }, [open]);

  const handleDownloadSample = () => {
    if (!selectedCategory) return;

    const escapeCsvCell = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const headers = ["barcode"];
    const sampleRow = ["BARCODE001"];

    selectedCategory.attributes.forEach((attr) => {
      if (attr.name === "barcode") return;
      headers.push(attr.name);

      let sampleVal = "";
      if (attr.type === "number") {
        sampleVal = "100";
      } else if (attr.type === "boolean") {
        sampleVal = "true";
      } else if (attr.type === "select" && attr.options && attr.options.length > 0) {
        sampleVal = attr.options[0];
      } else if (attr.type === "date") {
        sampleVal = new Date().toISOString().split("T")[0];
      } else {
        sampleVal = `Sample ${attr.label || attr.name}`;
      }
      sampleRow.push(sampleVal);
    });

    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      sampleRow.map(escapeCsvCell).join(",")
    ].join("\n") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sample_${selectedCategory.name.toLowerCase().replace(/\s+/g, "_")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = async (file: File) => {
    if (!selectedCategory) return;

    setIsProcessingFile(true);
    setFileName(file.name);
    setErrors([]);
    setParsedData([]);

    try {
      let rawData: unknown[] = [];

      if (file.name.endsWith(".csv")) {
        rawData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data as unknown[]),
            error: (error) => reject(error),
          });
        });
      } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      } else if (file.name.endsWith(".json")) {
        const text = await file.text();
        const parsedJson = JSON.parse(text);
        rawData = Array.isArray(parsedJson) ? (parsedJson as unknown[]) : ((parsedJson.assets as unknown[]) || [parsedJson]);
      } else {
        throw new Error("Unsupported file format. Please upload a .csv, .xlsx, or .json file.");
      }

      const shape: Record<string, z.ZodTypeAny> = {
        barcode: z.string().min(1, "Barcode is required"),
      };

      selectedCategory.attributes.forEach((attr) => {
        if (attr.name === "barcode") return;
        let fieldSchema: z.ZodTypeAny;

        if (attr.type === "number") {
          fieldSchema = z.coerce.number({
            message: `'${attr.label || attr.name}' must be a valid number`,
          });
        } else if (attr.type === "boolean") {
          fieldSchema = z.boolean({
            message: `'${attr.label || attr.name}' must be a boolean (true/false)`,
          });
        } else {
          fieldSchema = z.string();
        }

        if (attr.required) {
          if (attr.type === "number") {
            fieldSchema = (fieldSchema as z.ZodNumber).min(0.0001, `'${attr.label || attr.name}' is required`);
          } else if (attr.type === "boolean") {
            fieldSchema = (fieldSchema as z.ZodBoolean);
          } else {
            fieldSchema = (fieldSchema as z.ZodString).min(1, `'${attr.label || attr.name}' is required`);
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

      const rowSchema = z.object(shape);

      const newParsedData: ParsedAsset[] = [];
      const newErrors: ValidationError[] = [];

      rawData.forEach((row, index) => {
        const rowNumber = index + 2;
        const rowData = row as Record<string, unknown>;

        const cleanedRow: Record<string, string | number | boolean | null | undefined> = {
          barcode: rowData["barcode"]?.toString().trim() || rowData["Asset Barcode"]?.toString().trim() || "",
        };

        selectedCategory.attributes.forEach((attr) => {
          if (attr.name === "barcode") return;
          const val = rowData[attr.name] ?? rowData[attr.label];

          if (val !== undefined && val !== null && val !== "") {
            if (attr.type === "boolean") {
              const strVal = val.toString().toLowerCase();
              if (strVal === "true" || strVal === "yes" || strVal === "1") {
                cleanedRow[attr.name] = true;
              } else if (strVal === "false" || strVal === "no" || strVal === "0") {
                cleanedRow[attr.name] = false;
              } else {
                cleanedRow[attr.name] = val as string | number | boolean | null | undefined;
              }
            } else {
              cleanedRow[attr.name] = val as string | number | boolean | null | undefined;
            }
          }
        });

        const validation = rowSchema.safeParse(cleanedRow);

        if (!validation.success) {
          validation.error.issues.forEach((err) => {
            newErrors.push({
              row: rowNumber,
              message: err.message,
            });
          });
        } else {
          const { barcode, ...values } = validation.data as {
            barcode: string;
            [key: string]: string | number | boolean | null | undefined;
          };
          newParsedData.push({
            barcode,
            values: values || {},
          });
        }
      });

      setParsedData(newParsedData);
      setErrors(newErrors);
      setStep(2);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process file";
      toast.error(message);
      setFileName(null);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = async () => {
    if (errors.length > 0) {
      toast.error("Please fix all errors before uploading.");
      return;
    }

    if (parsedData.length === 0) {
      toast.error("No valid data to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const { error } = await bulkCreateAssets(projectId, selectedCategoryId, parsedData);

      if (error) {
        toast.error(error);
      } else {
        toast.success(`Successfully uploaded ${parsedData.length} assets.`);
        onSuccess();
      }
    } catch {
      toast.error("An unexpected error occurred during bulk upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border border-border/60 text-foreground overflow-hidden flex flex-col p-0 h-[85vh] sm:h-auto sm:max-h-[90vh] shadow-2xl rounded-2xl">
        <div className="p-8 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Upload className="h-5 w-5 text-primary" />
              Bulk Upload Assets
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add multiple assets at once using a CSV, Excel, or JSON file.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Dynamic Progress Stepper */}
        <div className="flex items-center justify-between px-8 py-4 border-y border-border/60 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step === 1 ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 font-black" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>Configuration</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/45" />
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step === 2 ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 font-black" : "bg-muted text-muted-foreground border border-border"}`}>
              2
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>Preview & Verify</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-8 py-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Select Category</label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger className="w-full bg-muted/30 border-border/80 focus:ring-primary/20 text-foreground shadow-sm h-12 rounded-xl text-sm font-semibold transition-all">
                        <SelectValue placeholder="Choose a category for the uploaded assets" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-xl">
                        {safeCategories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)} className="cursor-pointer focus:bg-muted text-foreground p-3 rounded-lg m-1">
                            <div className="font-semibold">{category.name}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      All assets in the uploaded file must belong to this category to validate constraints correctly.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedCategoryId && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-2xl p-5 shadow-inner relative overflow-hidden backdrop-blur-xs">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">Need a template?</p>
                            <p className="text-xs text-muted-foreground max-w-sm">Download a sample file with the correct headers for this category.</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleDownloadSample} className="gap-2 bg-card hover:bg-muted border-border/80 text-foreground shadow-sm rounded-lg active:scale-95 transition-transform cursor-pointer font-bold text-xs">
                            <Download className="h-4 w-4 text-primary" />
                            Download Sample
                          </Button>
                        </div>

                        <div
                          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                            isProcessingFile 
                              ? "border-primary bg-primary/5" 
                              : isDragOver
                                ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/5"
                                : "border-border/80 hover:border-primary/50 hover:bg-muted/15 cursor-pointer"
                          }`}
                          onClick={() => !isProcessingFile && fileInputRef.current?.click()}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv, .xls, .xlsx, .json"
                            onChange={handleFileUpload}
                          />

                          {isProcessingFile ? (
                            <>
                              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                              <p className="text-sm font-semibold text-foreground">Processing file...</p>
                            </>
                          ) : (
                            <>
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary shadow-inner">
                                <Upload className="h-6 w-6" />
                              </div>
                              <p className="text-sm font-semibold mb-1 text-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">CSV, XLSX, or JSON (max 5MB)</p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-1 flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      {fileName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Found {parsedData.length} valid row{parsedData.length !== 1 ? 's' : ''}
                      {errors.length > 0 && ` and ${errors.length} error${errors.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-muted-foreground cursor-pointer rounded-lg hover:bg-muted font-bold px-3 py-1">
                    Change File
                  </Button>
                </div>

                {errors.length > 0 && (
                  <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive rounded-2xl p-5 shadow-inner">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <AlertTitle className="text-sm font-bold leading-none">Validation Failed</AlertTitle>
                    <AlertDescription className="text-xs mt-3">
                      Please fix the following errors in your file. The entire upload is disabled until fields are corrected.
                      <div className="mt-4 max-h-32 overflow-y-auto space-y-2 pr-2">
                        {errors.map((error, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-destructive font-medium">
                            <span className="font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded text-[10px] whitespace-nowrap mt-0.5 border border-destructive/15">Row {error.row}</span>
                            <span className="text-[11px] leading-relaxed">{error.message}</span>
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {errors.length === 0 && parsedData.length > 0 && (
                  <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-5 shadow-inner">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <AlertTitle className="text-sm font-bold leading-none flex items-center gap-1.5">
                      Ready to Upload
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-2 font-medium">
                      All {parsedData.length} rows passed validation. You can review the records in the grid below.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex-1 min-h-[220px] border border-border/60 rounded-xl overflow-hidden bg-muted/10 shadow-inner">
                  <ScrollArea className="h-full w-full">
                    <Table>
                      <TableHeader className="bg-muted/30 sticky top-0 z-10 border-b border-border/60">
                        <TableRow>
                          <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground p-3">Barcode</TableHead>
                          {selectedCategory?.attributes
                            .filter((attr) => attr.name !== "barcode")
                            .map((attr) => (
                              <TableHead key={attr.name} className="text-xs font-black uppercase tracking-wider text-muted-foreground p-3">
                                {attr.label || attr.name}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.slice(0, 10).map((row, idx) => (
                          <TableRow key={idx} className="text-sm border-b border-border/40 hover:bg-muted/15 transition-all">
                            <TableCell className="font-bold text-foreground p-3">{row.barcode}</TableCell>
                            {selectedCategory?.attributes
                              .filter((attr) => attr.name !== "barcode")
                              .map((attr) => (
                                <TableCell key={attr.name} className="text-muted-foreground/80 p-3 font-semibold">
                                  {row.values[attr.name] !== undefined ? String(row.values[attr.name]) : "-"}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  {parsedData.length > 10 && (
                    <div className="text-center py-2 text-xs font-bold text-muted-foreground bg-muted/20 border-t border-border/60 uppercase tracking-widest text-[9px]">
                      Showing first 10 rows
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                  <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground cursor-pointer rounded-xl h-11 px-5 font-bold">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={errors.length > 0 || parsedData.length === 0 || isUploading}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/95 border-none cursor-pointer rounded-xl h-11 px-8 font-black tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-primary-foreground" />
                        Upload {parsedData.length} Assets
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
