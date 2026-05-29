"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { ChevronDown, Trash2, X, PlusCircle } from "lucide-react";

import { Category } from "./category.types";

type Props = {
  category: Category | null;
  open: boolean;
  onClose: () => void;
};

export default function EditCategorySheet({ category, open, onClose }: Props) {
  if (!category) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-96 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                Active View
              </span>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold">Edit Category</h3>

            <p className="text-sm text-slate-500 mt-1">{category.name}</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">
                Attributes
              </label>

              <div className="space-y-3">
                {category.attributes.map((attr) => (
                  <div
                    key={attr.name}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50"
                  >
                    {/* Attribute Name + Required */}
                    <div className="flex items-center justify-between mb-3">
                      <Input
                        defaultValue={attr.name}
                        className="bg-transparent border-none p-0 focus-visible:ring-0 text-sm font-semibold w-2/3"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">
                          Required
                        </span>

                        <Switch />
                      </div>
                    </div>

                    {/* Type + Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 flex items-center justify-between text-xs">
                        <span>{attr.type}</span>

                        <ChevronDown className="w-3 h-3" />
                      </div>

                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Attribute */}
              <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/50 hover:text-primary transition-all">
                <PlusCircle className="w-4 h-4" />
                Add New Attribute
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
            <Button className="flex-1 font-bold">Save Changes</Button>

            <Button variant="outline" className="font-bold" onClick={onClose}>
              Discard
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
