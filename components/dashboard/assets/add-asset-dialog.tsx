"use client";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { RefreshCcw, Info, MapPin, ChevronDown } from "lucide-react";

export default function AddAssetDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/40 backdrop-blur-xs" />
      <DialogContent className="max-w-[650px] p-0 bg-slate-950 border border-slate-800">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-slate-800">
          <DialogTitle className="text-2xl font-bold">
            Add New Asset
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Enter the details to register a new physical or ICT asset.
          </p>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[70vh]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Asset Name</Label>
              <Input placeholder="e.g. Dell Precision 5570" />
            </div>

            <div className="space-y-2 md:ml-auto">
              <Label>Category</Label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Barcode */}
          <div className="space-y-2">
            <Label>Barcode ID</Label>

            <div className="flex gap-2">
              <Input placeholder="AST-XXXX" className="flex-1" />

              <Button type="button" variant="secondary" className="gap-2">
                <RefreshCcw size={16} />
                Auto-generate
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              placeholder="Enter technical specifications or condition notes..."
              rows={3}
            />
          </div>

          {/* Dynamic Attributes */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="text-primary" size={16} />

              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Laptop Specifications
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Serial Number
                </Label>

                <Input placeholder="S/N: 5CD23..." />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Model</Label>

                <Input placeholder="XPS 15" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  Purchase Date
                </Label>

                <Input type="date" />
              </div>
            </div>
          </div>

          {/* Location + Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Location</Label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="hq1">HQ - Floor 1 (Lobby)</SelectItem>

                  <SelectItem value="hq2">
                    HQ - Floor 2 (Engineering)
                  </SelectItem>

                  <SelectItem value="remote">
                    Remote (Work from Home)
                  </SelectItem>

                  <SelectItem value="warehouse">Warehouse Alpha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned User</Label>

              <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="size-7 rounded-full bg-slate-700" />

                <span className="text-sm flex-1">Sarah Jenkins</span>

                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between gap-3 bg-slate-900">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button className="text-white">Create Asset</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
