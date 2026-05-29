"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlusCircle, Trash } from "lucide-react";

type Attribute = {
  name: string;
  type: string;
  required: boolean;
};

export default function AddCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "Serial Number", type: "text", required: true },
    { name: "Purchase Date", type: "date", required: false },
  ]);

  function addAttribute() {
    setAttributes([...attributes, { name: "", type: "text", required: false }]);
  }

  function removeAttribute(index: number) {
    setAttributes(attributes.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/40 backdrop-blur-xs" />
      <DialogContent className="max-w-[650px] p-0 bg-slate-950 border border-slate-800">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-800">
          <DialogTitle className="text-2xl font-bold">
            Add New Category
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Define a new type of asset and its required tracking attributes.
          </p>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input placeholder="e.g., Medical Equipment" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Enter category description..." rows={3} />
          </div>

          {/* Attributes */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tracking Attributes</h3>

              <Button
                size="sm"
                variant="ghost"
                onClick={addAttribute}
                className="gap-2"
              >
                <PlusCircle size={16} />
                Add Attribute
              </Button>
            </div>

            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg bg-slate-900 border border-slate-800"
                >
                  {/* Name */}
                  <div className="col-span-5">
                    <Input
                      value={attr.name}
                      placeholder="Attribute Name"
                      onChange={(e) => {
                        const copy = [...attributes];
                        copy[index].name = e.target.value;
                        setAttributes(copy);
                      }}
                    />
                  </div>

                  {/* Type */}
                  <div className="col-span-3">
                    <Select
                      value={attr.type}
                      onValueChange={(value) => {
                        const copy = [...attributes];
                        copy[index].type = value;
                        setAttributes(copy);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Required */}
                  <div className="col-span-3 flex items-center gap-2 justify-center">
                    <Switch
                      checked={attr.required}
                      onCheckedChange={(val) => {
                        const copy = [...attributes];
                        copy[index].required = val;
                        setAttributes(copy);
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAttribute(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-800 bg-slate-900 flex justify-between gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button className="bg-primary text-white">Create Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
