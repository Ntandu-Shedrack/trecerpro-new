"use client";

import { useRef, useState } from "react";
import {
  CloudUpload,
  Download,
  HelpCircle,
  TableIcon,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import BulkUploadProgress from "@/components/dashboard/bulk-upload/bulk-upload-progress";

export default function UploadStep({ next }: { next: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function browse() {
    inputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  const fileSize = file ? (file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-white">Bulk Upload</h1>
        <p className="text-slate-400 text-lg">
          Step 1: Upload your data file to begin the import process.
        </p>
      </div>

      <BulkUploadProgress step={1} />

      {/* Upload Zone */}
      <Card className="border-slate-800 bg-linear-to-br from-slate-900/50 to-card">
        <CardContent className="p-8 md:p-12">
          <div
            onClick={browse}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            className={`flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-2xl p-12 md:p-16 transition-all duration-300 cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : file
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-slate-700 hover:border-primary/60"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={onFile}
            />

            <div
              className={`size-20 rounded-full flex items-center justify-center transition-all ${
                file
                  ? "bg-green-500/10"
                  : isDragActive
                    ? "bg-primary/20"
                    : "bg-primary/10"
              }`}
            >
              <CloudUpload
                className={`w-10 h-10 transition-colors ${
                  file
                    ? "text-green-500"
                    : isDragActive
                      ? "text-primary"
                      : "text-primary"
                }`}
              />
            </div>

            <div className="text-center">
              <p className="text-lg md:text-xl font-semibold text-white">
                {file ? "File ready to upload" : "Drag & drop your file here"}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Support for CSV or Excel files up to 50MB.
                <br />
                Maximum 10,000 rows per upload.
              </p>
            </div>

            {file && (
              <div className="w-full max-w-sm bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">{fileSize} MB</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="text-white"
              variant={file ? "secondary" : "default"}
              onClick={browse}
            >
              {file ? "Choose Different File" : "Browse Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates & Help */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Resources</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Template */}
          <Card className="border-slate-800 bg-card hover:bg-slate-800/50 hover:border-green-500/40 transition-all group">
            <CardContent className="flex gap-4 p-6">
              <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
                <TableIcon className="text-green-600 w-6 h-6" />
              </div>

              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-white">CSV Template</h4>

                <p className="text-xs text-slate-400">
                  Standard format with required headers.
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-green-500 text-sm font-semibold hover:text-green-400 transition"
                >
                  Download Template
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-slate-800 bg-card hover:bg-slate-800/50 hover:border-primary/40 transition-all group">
            <CardContent className="flex gap-4 p-6">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <HelpCircle className="text-primary w-6 h-6" />
              </div>

              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-white">Need Help?</h4>

                <p className="text-xs text-slate-400">
                  View documentation for formatting requirements.
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:text-primary/80 transition"
                >
                  View Guide
                  <HelpCircle className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4">
        <Button
          className="text-white px-8"
          disabled={!file}
          onClick={next}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
