"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
  initialCategories: string[];
  onNext: (categories: string[]) => void;
  onBack: () => void;
}

export function CategoriesStep({ initialCategories, onNext, onBack }: Props) {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [value, setValue] = useState("");

  const addCategory = () => {
    if (!value.trim()) return;
    setCategories([...categories, value]);
    setValue("");
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <Card className="max-w-4xl py-10 px-6 mx-auto bg-white border shadow-lg shadow-primary/40">
      <CardContent className="space-y-6 p-10">
        <div className="text-center">
          <h1 className="text-2xl text-slate-900 font-bold">
            Set Up Your Asset Categories
          </h1>
          <p className="text-muted mt-2">
            Categories help you organize your inventory and generate detailed
            reports. You can always add more later in your settings.
          </p>
        </div>

        <div className="flex gap-2 space-y-4">
          <Input
            placeholder="e.g., Office Equipment, Heavy Machinery..."
            value={value}
            className="text-muted border border-muted-foreground/50"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button className="text-white" onClick={addCategory}>
            <span className="ml-auto">
              <Plus />
            </span>{" "}
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div
              key={cat}
              className="group flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-medium transition-all hover:bg-primary/20 cursor-default"
            >
              {cat}
              <button
                className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary/30 transition-colors"
                onClick={() => removeCategory(cat)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 p-6 border-t">
        <Button className="text-slate-800" variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button
          className="text-white"
          onClick={() => onNext(categories)}
          disabled={categories.length === 0}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
