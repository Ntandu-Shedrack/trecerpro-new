"use client";

import {
  CheckCircle,
  FileText,
  Info,
  Sparkles,
  AlertTriangle,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import BulkUploadProgress from "@/components/dashboard/bulk-upload/bulk-upload-progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MappingRow = {
  fileColumn: string;
  mappedField?: string;
  preview: string;
  status: "auto" | "manual" | "required";
};

const rows: MappingRow[] = [
  {
    fileColumn: "Serial_Number",
    mappedField: "Asset ID",
    preview: "SN-4829-X",
    status: "auto",
  },
  {
    fileColumn: "Device_Name",
    mappedField: "Asset Name",
    preview: "MacBook Pro 14",
    status: "auto",
  },
  {
    fileColumn: "Purchase_Date",
    preview: "2023-11-24",
    status: "required",
  },
  {
    fileColumn: "Location_ID",
    preview: "HQ-East-01",
    status: "manual",
  },
];

export default function MappingStep({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  return (
    <div className="mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Map Your Columns</h1>
        <p className="text-slate-400">
          Match the columns from your uploaded file to TracerPro asset fields to
          ensure data accuracy.
        </p>
      </div>

      <BulkUploadProgress step={2} />

      {/* Mapping Table */}
      <Card className="border-slate-800 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle> File Columns against TracerPro Columns</CardTitle>
            <CardDescription>
              Ensure the mapping of the columns in the uploaded file matches the
              TracerPro columns
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/50">
                <TableHead>File Column</TableHead>
                <TableHead>TracerPro Field</TableHead>
                <TableHead>Matching Status</TableHead>
                <TableHead className="text-right">Preview</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.fileColumn}>
                  {/* File Column */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-medium">
                        {row.fileColumn}
                      </span>
                    </div>
                  </TableCell>

                  {/* Mapping Select */}
                  <TableCell>
                    {row.status === "auto" ? (
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        {row.mappedField}
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <Select>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select TracerPro Field..." />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="asset_id">Asset ID</SelectItem>
                          <SelectItem value="asset_name">Asset Name</SelectItem>
                          <SelectItem value="acquisition_date">
                            Acquisition Date
                          </SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {row.status === "auto" && (
                      <Badge className="bg-emerald-900/40 text-emerald-400">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Auto-matched
                      </Badge>
                    )}

                    {row.status === "required" && (
                      <Badge className="bg-amber-900/40 text-amber-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Action Required
                      </Badge>
                    )}

                    {row.status === "manual" && (
                      <Badge className="bg-slate-800 text-slate-300">
                        <Pencil className="w-3 h-3 mr-1" />
                        Manual
                      </Badge>
                    )}
                  </TableCell>

                  {/* Preview */}
                  <TableCell className="text-right text-xs text-slate-400 italic">
                    {row.preview}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300"
          onClick={prev}
        >
          Back to Upload
        </Button>

        <div className="flex gap-4">
          <Button variant="secondary" disabled>
            Save Mapping
          </Button>

          <Button className="text-white" onClick={next}>
            Continue to Preview
          </Button>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/10">
        <Info className="h-4 w-4 text-primary" />

        <AlertTitle className="text-primary">Pro Tip</AlertTitle>

        <AlertDescription>
          Naming your Excel columns identically to TracerPro fields (e.g.,
          &quot;Asset ID&quot; instead of &quot;Serial_Number&quot;) will allow
          the system to automatically map them next time.
        </AlertDescription>
      </Alert>
    </div>
  );
}
