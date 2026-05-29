import { Pencil, Copy, Trash, Laptop, ClipboardCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Category } from "./category.types";

type Props = {
  category: Category;
  onEdit: () => void;
};

export default function CategoryCard({ category, onEdit }: Props) {
  const visibleAttributes = category.attributes.slice(0, 3);
  const remaining = category.attributes.length - visibleAttributes.length;

  return (
    <Card className="group relative bg-card border-zinc-800 rounded-xl p-5 hover:border-primary/50 transition-all">
      <CardContent className="p-0">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Icon + Title */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Laptop className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg">{category.name}</h3>

              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <ClipboardCheck className="w-3 h-3" />
                {category.assetCount} Assets assigned
              </p>
            </div>
          </div>

          {/* Hover Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:bg-zinc-800"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:bg-zinc-800"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Attributes */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Attributes ({category.attributes.length})
          </p>

          <div className="flex flex-wrap gap-2">
            {visibleAttributes.map((attr) => (
              <span
                key={attr.name}
                className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-medium text-zinc-400"
              >
                {attr.name}
              </span>
            ))}

            {remaining > 0 && (
              <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-medium text-zinc-400">
                +{remaining} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
