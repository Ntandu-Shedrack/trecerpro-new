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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Card className="flex flex-col min-h-[600px] py-10 px-6 mx-auto bg-white border border-slate-200">
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

          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <Table>
              {/* HEADER */}
              <TableHeader>
                <TableRow className="bg-muted/40 border-b">
                  <TableHead className="pl-8 py-4 text-sm font-semibold text-muted-foreground tracking-wide">
                    Attribute
                  </TableHead>
                  <TableHead className="py-4 text-sm font-semibold text-muted-foreground tracking-wide">
                    Type
                  </TableHead>
                  <TableHead className="py-4 text-sm font-semibold text-muted-foreground text-center tracking-wide">
                    Required
                  </TableHead>
                  <TableHead className="pr-8 py-4 text-right text-sm font-semibold text-muted-foreground tracking-wide">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* BODY */}
              <TableBody>
                {attributes[activeCategory]?.map((attr) => (
                  <TableRow
                    key={attr.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    {/* ATTRIBUTE NAME */}
                    <TableCell className="pl-8 py-4">
                      <Input
                        value={attr.name}
                        placeholder="Attribute Name"
                        onChange={(e) =>
                          updateAttribute(attr.id, "name", e.target.value)
                        }
                        className="h-9 bg-background"
                      />
                    </TableCell>

                    {/* DATA TYPE */}
                    <TableCell className="py-4">
                      <Select
                        value={attr.type}
                        onValueChange={(value) =>
                          updateAttribute(attr.id, "type", value)
                        }
                      >
                        <SelectTrigger className="h-9 bg-background w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DATA_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* REQUIRED */}
                    <TableCell className="py-4 text-center">
                      <Switch
                        checked={attr.required}
                        onCheckedChange={(val) =>
                          updateAttribute(attr.id, "required", val)
                        }
                      />
                    </TableCell>

                    {/* DELETE */}
                    <TableCell className="pr-8 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAttribute(attr.id)}
                      >
                        <Trash className="h-4 w-4 text-muted hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* EMPTY STATE */}
            {attributes[activeCategory]?.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  No attributes configured yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="sticky bottom-0 mt-10 border-t py-6">
        <div className="flex justify-between items-center">
          <Button
            className="text-slate-800 border border-slate-200"
            variant="ghost"
            onClick={onBack}
          >
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
