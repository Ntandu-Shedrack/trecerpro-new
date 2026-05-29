import { UploadCloud } from "lucide-react";

export default function BulkUploadProgress({ step }: { step: number }) {
  const percent = (step / 4) * 100;

  const titles = [
    "Upload File",
    "Column Mapping",
    "Data Validation",
    "Review & Import",
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <UploadCloud className="text-primary w-5 h-5" />
          <p className="text-slate-100 font-semibold">
            Step {step} of 4: {titles[step - 1]}
          </p>
        </div>

        <p className="text-primary text-sm font-bold">
          {Math.round(percent)}% Complete
        </p>
      </div>

      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
