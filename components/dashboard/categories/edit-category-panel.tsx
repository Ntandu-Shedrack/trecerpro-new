import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Trash2, X, PlusCircle, GripVertical } from "lucide-react";

import { Category } from "./category.types";

type Props = {
  category: Category;
  onClose: () => void;
};

export default function EditCategoryPanel({ category, onClose }: Props) {
  const attributeCount = category.attributes?.length ?? 0;

  return (
    <div className="w-[420px] flex-shrink-0">
      <div className="sticky top-0 bg-card border rounded-xl overflow-hidden shadow-xl flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
              Active View
            </span>

            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Edit Category</h3>

            <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
              {attributeCount}{" "}
              {attributeCount === 1 ? "Attribute" : "Attributes"}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>

            <Input id="categoryName" defaultValue={category.name} />

            <p className="text-xs text-muted-foreground">
              Update the name and manage the attributes shown for this category.
            </p>
          </div>
        </div>

        <Separator />

        {/* Scroll Area */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
                Attributes
              </Label>

              {attributeCount === 0 ? (
                <Card className="border-dashed p-6 text-center text-sm text-muted-foreground">
                  No attributes yet. Add your first attribute.
                </Card>
              ) : (
                <div className="space-y-3">
                  {category.attributes.map((attr) => (
                    <Card key={attr.name} className="p-4 space-y-3">
                      {/* Name + Required */}
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />

                        <Input
                          defaultValue={attr.name}
                          className="flex-1 text-sm"
                        />

                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">
                            Required
                          </Label>

                          <Switch />
                        </div>
                      </div>

                      {/* Type + Delete */}
                      <div className="flex items-center gap-2">
                        <Select defaultValue={attr.type}>
                          <SelectTrigger className="flex-1 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>Delete attribute</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Attribute */}

              <Button
                variant="outline"
                className="w-full mt-4 border-dashed gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Attribute
              </Button>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Footer */}

        <div className="p-6 flex gap-3">
          <Button className="flex-1">Save Changes</Button>

          <Button variant="outline" onClick={onClose}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
}
