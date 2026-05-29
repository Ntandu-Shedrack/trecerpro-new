"use client";

import { Search, Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import AddAssetDialog from "./add-asset-dialog";

export function AssetListHeader() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="space-y-6 mb-8 p-8">
      {/* PAGE HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-wider">
            Asset Inventory
          </h1>

          <p className="text-muted-foreground">
            Manage and track enterprise assets by category across all locations.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button
            className="gap-2 text-white"
            onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Asset
          </Button>
        </div>
      </div>

      {/* TABS */}

      <Tabs defaultValue="category" className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto gap-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
          >
            All Assets
          </TabsTrigger>

          <TabsTrigger
            value="category"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
          >
            Grouped by Category
          </TabsTrigger>

          <TabsTrigger
            value="recent"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
          >
            Recently Added
          </TabsTrigger>

          <TabsTrigger
            value="maintenance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
          >
            Maintenance Needed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* FILTERS */}

      <div className="flex flex-wrap items-center gap-4">
        {/* SEARCH */}

        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search assets by serial, owner, or ID..."
            className="pl-9"
          />
        </div>

        {/* FILTERS */}

        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Under Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Location: All" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Location: All</SelectItem>
              <SelectItem value="hq">HQ - San Francisco</SelectItem>
              <SelectItem value="dc">Data Center - Ashburn</SelectItem>
              <SelectItem value="london">London Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AddAssetDialog open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
