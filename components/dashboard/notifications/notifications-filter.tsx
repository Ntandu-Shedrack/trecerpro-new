"use client";

import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FilterProps {
  search: string;
  setSearch: (s: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
}

export function NotificationsFilter({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  priorityFilter,
  setPriorityFilter,
}: FilterProps) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "assets", label: "Assets" },
    { id: "security", label: "Security" },
    { id: "organization", label: "Team" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="flex flex-col gap-4 border-b border-border/40 pb-4">
      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-none border-b border-border/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs and Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Priority: </span>
              <span className="font-semibold capitalize">{priorityFilter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border-border text-foreground">
            <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={priorityFilter} onValueChange={setPriorityFilter}>
              <DropdownMenuRadioItem value="all" className="cursor-pointer">All Priorities</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="info" className="cursor-pointer">Info</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="warning" className="cursor-pointer">Warning</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="critical" className="cursor-pointer">Critical</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
