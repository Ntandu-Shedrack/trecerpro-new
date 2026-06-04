"use client";

import * as React from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2
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
  name: string;
  description?: string;
  values: Record<string, any>;
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

  const [parsedData, setParsedData] = React.useState<ParsedAsset[]>([]);
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedCategoryId("");
      setParsedData([]);
      setErrors([]);
      setFileName(null);
    }
  }, [open]);

  const handleDownloadSample = () => {
    if (!selectedCategory) return;

    const headers = ["name", "description"];
    selectedCategory.attributes.forEach((attr) => {
      headers.push(attr.name);
    });

    const csvContent = headers.join(",") + "\n";
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
      let rawData: any[] = [];

      if (file.name.endsWith(".csv")) {
        rawData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
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
        rawData = Array.isArray(parsedJson) ? parsedJson : (parsedJson.assets || [parsedJson]);
      } else {
        throw new Error("Unsupported file format. Please upload a .csv, .xlsx, or .json file.");
      }

      // Build dynamic validation schema using Zod
      const shape: Record<string, z.ZodTypeAny> = {
        name: z.string().min(1, "Name is required"),
        description: z.string().optional().nullable(),
      };

      selectedCategory.attributes.forEach((attr) => {
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
        const rowData = row as Record<string, any>;

        const cleanedRow: Record<string, any> = {
          name: rowData["name"]?.toString().trim() || rowData["Asset Name"]?.toString().trim() || "",
          description: rowData["description"]?.toString().trim() || "",
        };

        selectedCategory.attributes.forEach((attr) => {
          let val = rowData[attr.name] ?? rowData[attr.label];

          if (val !== undefined && val !== null && val !== "") {
            if (attr.type === "boolean") {
              const strVal = val.toString().toLowerCase();
              if (strVal === "true" || strVal === "yes" || strVal === "1") {
                cleanedRow[attr.name] = true;
              } else if (strVal === "false" || strVal === "no" || strVal === "0") {
                cleanedRow[attr.name] = false;
              } else {
                cleanedRow[attr.name] = val; // Let zod validate and throw invalid type
              }
            } else {
              cleanedRow[attr.name] = val;
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
          const { name, description, ...values } = validation.data as {
            name: string;
            description?: string | null;
            [key: string]: any;
          };
          newParsedData.push({
            name,
            description: description || undefined,
            values: values || {},
          });
        }
      });

      setParsedData(newParsedData);
      setErrors(newErrors);
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to process file");
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
    } catch (err) {
      toast.error("An unexpected error occurred during bulk upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-slate-950 border border-slate-800 text-foreground overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Upload Assets
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Add multiple assets at once using a CSV, Excel, or JSON file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 py-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-350">Select Category</label>
                  <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                    <SelectTrigger className="w-full bg-slate-900 border-slate-800 focus:ring-primary/20 text-white shadow-sm h-11">
                      <SelectValue placeholder="Choose a category for the uploaded assets" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800 text-foreground">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)} className="cursor-pointer focus:bg-primary/5 focus:text-primary text-white">
                          <div className="font-semibold">{category.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400 mt-2">
                    All assets in the uploaded file must belong to this category. This ensures the correct attributes are validated.
                  </p>
                </div>

                {selectedCategoryId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-xl p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Need a template?</p>
                        <p className="text-xs text-slate-400 mt-1">Download a sample file with the correct headers for this category.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleDownloadSample} className="gap-2 bg-slate-900 border-slate-800 text-white">
                        <Download className="h-4 w-4 text-primary" />
                        Download Sample
                      </Button>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${isProcessingFile ? "border-primary bg-primary/5" : "border-slate-800 hover:border-primary/50 hover:bg-slate-900/20 cursor-pointer"
                        }`}
                      onClick={() => !isProcessingFile && fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
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
                          <p className="text-sm font-semibold text-slate-300">Processing file...</p>
                        </>
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <FileSpreadsheet className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-semibold mb-1 text-slate-300">Click to upload or drag and drop</p>
                          <p className="text-xs text-slate-400">CSV, XLSX, or JSON (max 5MB)</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 py-4 flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2 text-white">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      {fileName}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Found {parsedData.length} valid row{parsedData.length !== 1 ? 's' : ''}
                      {errors.length > 0 && ` and ${errors.length} error${errors.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-slate-400">
                    Change File
                  </Button>
                </div>

                {errors.length > 0 && (
                  <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm font-bold">Validation Failed</AlertTitle>
                    <AlertDescription className="text-xs mt-2">
                      Please fix the following errors in your file. The entire upload is disabled until fields are corrected.
                      <div className="mt-3 max-h-24 overflow-y-auto space-y-1 pr-2">
                        {errors.map((error, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="font-mono bg-destructive/10 px-1.5 rounded text-[10px] whitespace-nowrap mt-0.5">Row {error.row}</span>
                            <span>{error.message}</span>
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {errors.length === 0 && parsedData.length > 0 && (
                  <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle className="text-sm font-bold">Ready to Upload</AlertTitle>
                    <AlertDescription className="text-xs mt-1">
                      All {parsedData.length} rows passed type checks. You can review the records below.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex-1 min-h-[200px] border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
                  <ScrollArea className="h-full w-full">
                    <Table>
                      <TableHeader className="bg-slate-900/50 sticky top-0 z-10 border-b border-slate-800">
                        <TableRow>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400">Name</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</TableHead>
                          {selectedCategory?.attributes.map((attr) => (
                            <TableHead key={attr.name} className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {attr.label || attr.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.slice(0, 10).map((row, idx) => (
                          <TableRow key={idx} className="text-sm border-b border-slate-800/50">
                            <TableCell className="font-medium text-white">{row.name}</TableCell>
                            <TableCell className="text-slate-400">{row.description || "-"}</TableCell>
                            {selectedCategory?.attributes.map((attr) => (
                              <TableCell key={attr.name} className="text-slate-300">
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
                    <div className="text-center py-2 text-xs text-slate-500 bg-slate-900/50 border-t border-slate-800">
                      Showing first 10 rows
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={errors.length > 0 || parsedData.length === 0 || isUploading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
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
