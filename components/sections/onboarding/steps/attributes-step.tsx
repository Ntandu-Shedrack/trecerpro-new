/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

type Attribute = {
  id: string;
  name: string;
  type: string;
  required: boolean;
};

interface Props {
  categories: string[];
  onBack: () => void;
  onComplete: (data: Record<string, Attribute[]>) => void;
}

const DATA_TYPES = ["Text", "Number", "Date", "Dropdown", "Currency"];

export function AttributesStep({ categories, onBack, onComplete }: Props) {
  // Store attributes per category
  const [attributes, setAttributes] = useState<Record<string, Attribute[]>>(
    Object.fromEntries(categories.map((c) => [c, []])),
  );

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const addAttribute = () => {
    const newAttr: Attribute = {
      id: crypto.randomUUID(),
      name: "",
      type: "Text",
      required: false,
    };

    setAttributes((prev) => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newAttr],
    }));
  };

  const updateAttribute = (id: string, field: keyof Attribute, value: any) => {
    setAttributes((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((attr) =>
        attr.id === id ? { ...attr, [field]: value } : attr,
      ),
    }));
  };

  const deleteAttribute = (id: string) => {
    setAttributes((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter((attr) => attr.id !== id),
    }));
  };

  return (
    <Card className="flex flex-col min-h-[600px] py-10 px-6 mx-auto bg-white border shadow-lg shadow-primary/40">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl text-slate-900 font-bold">
          Configure Category Attributes
        </h1>
        <p className="text-muted max-w-lg mx-auto mt-2">
          Customize the fields for each asset category. Select a category from
          the left to define its unique tracking requirements.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Asset Categories
            </h3>
          </div>

          <nav className="p-2 space-y-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold truncate">{cat}</p>
                    <p className="text-xs opacity-70">
                      {attributes[cat]?.length} attributes
                    </p>
                  </div>

                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MAIN PANEL */}
        <div className="flex-1 border rounded-xl overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeCategory} Attributes
              </h2>
              <p className="text-sm text-muted">
                Configure data fields specific to track {activeCategory}.
              </p>
            </div>

            <Button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              onClick={addAttribute}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
              <TableHeader>
                <TableRow className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <TableHead className="px-6 py-4">Attribute Name</TableHead>
                  <TableHead className="px-6 py-4">Data Type</TableHead>
                  <TableHead className="px-6 py-4 text-center">
                    Required
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-200">
                {attributes[activeCategory]?.map((attr) => (
                  <TableRow
                    key={attr.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <Input
                        value={attr.name}
                        className="w-full text-muted border border-muted-foreground/50 bg-transparent focus:border-primary/30 focus:bg-white rounded-md py-1 px-2 text-sm font-medium outline-none"
                        onChange={(e) =>
                          updateAttribute(attr.id, "name", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <select
                        value={attr.type}
                        onChange={(e) =>
                          updateAttribute(attr.id, "type", e.target.value)
                        }
                        className="text-sm text-muted bg-slate-100 border-none rounded-sm focus:ring-2 focus:ring-primary w-full py-2 px-3"
                      >
                        {DATA_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <Switch
                        checked={attr.required}
                        onCheckedChange={(val) =>
                          updateAttribute(attr.id, "required", val)
                        }
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAttribute(attr.id)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {attributes[activeCategory]?.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No attributes added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="sticky bottom-0 mt-10 border-t py-6">
        <div className="flex justify-between items-center">
          <Button className="text-slate-800" variant="outline" onClick={onBack}>
            Back
          </Button>

          <Button className="text-white" onClick={() => onComplete(attributes)}>
            Complete Setup
          </Button>
        </div>
      </footer>
    </Card>
  );
}
