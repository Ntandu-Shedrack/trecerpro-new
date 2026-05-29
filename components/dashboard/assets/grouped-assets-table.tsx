/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssetCategorySection } from "./asset-category-section";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GroupedAssetsTable({ categories }: { categories: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      {categories.map((category, index) => (
        <AssetCategorySection key={index} {...category} />
      ))}

      {/* Footer Pagination */}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold dark:text-slate-300">
            {categories.length} Categories
          </span>
        </p>

        <div className="flex gap-2">
          <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900">
            <ChevronLeft size={18} />
          </button>

          <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
