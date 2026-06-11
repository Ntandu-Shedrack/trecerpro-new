"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NotificationsFilterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function NotificationsFilter({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}: NotificationsFilterProps) {
  const tabs = [
    { id: "all", label: "All Events" },
    { id: "unread", label: "Unread" },
    { id: "alerts", label: "Alerts" },
    { id: "system", label: "System" },
    { id: "organization", label: "Organization" },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between border-b border-border/60 px-6 py-4 bg-background/50">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                : "text-muted-foreground hover:bg-muted/80 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>
    </div>
  );
}
