# Notifications Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an interactive and aesthetically premium Notifications page with modular components for monitoring organization activities and critical system alerts.

**Architecture:** The page is structured into modular components: Header (stats summary), Filters (search, tab, priority), Items (cards), Details (Radix/shadcn Dialog for deep audits), and a central Orchestrator (List). State is stored in LocalStorage for client-side persistence and interactivity.

**Tech Stack:** Next.js (TSX), Tailwind CSS, Lucide React, Shadcn/UI components (Card, Button, Input, DropdownMenu, Dialog, Avatar).

---

### Task 1: Create Mock Data and Interfaces

**Files:**
- Create: `components/dashboard/notifications/mock-data.ts`

- [ ] **Step 1: Write the mock data and types**
  Write the mock data and typescript interface in `components/dashboard/notifications/mock-data.ts`.
  ```typescript
  export interface NotificationItem {
    id: string;
    type: "assets" | "security" | "organization" | "system";
    action: string;
    title: string;
    description: string;
    priority: "info" | "warning" | "critical";
    isRead: boolean;
    isArchived: boolean;
    created_at: string;
    user_name?: string;
    entity_name?: string;
    entity_type?: string;
    entity_id?: string;
    changes?: {
      before?: Record<string, string | number | boolean>;
      after?: Record<string, string | number | boolean>;
    };
    causer?: {
      name: string;
      email: string;
      avatar?: string;
    };
  }

  export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
      id: "ntf-1",
      type: "security",
      action: "failed_scan",
      title: "Unauthorized Scan Attempt",
      description: "An unauthorized device attempted to scan asset **MBP-2026-004** in NYC Cluster.",
      priority: "critical",
      isRead: false,
      isArchived: false,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      entity_type: "asset",
      entity_id: "MBP-2026-004",
      entity_name: "MacBook Pro 16\"",
      causer: {
        name: "Unknown Device (IP: 192.168.1.144)",
        email: "security-alert@tracerpro.com"
      }
    },
    {
      id: "ntf-2",
      type: "organization",
      action: "member_joined",
      title: "New Team Member Joined",
      description: "**Deborah Carter** accepted the invitation to join the organization as **Developer**.",
      priority: "info",
      isRead: false,
      isArchived: false,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      entity_type: "member",
      entity_name: "Deborah Carter",
      causer: {
        name: "Deborah Carter",
        email: "deborah@tracerpro.com",
        avatar: "DC"
      }
    },
    {
      id: "ntf-3",
      type: "assets",
      action: "batch_updated",
      title: "Batch Asset Update Success",
      description: "Successfully updated status to **In Service** for 24 server units in project **NYC-01**.",
      priority: "info",
      isRead: true,
      isArchived: false,
      created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
      entity_type: "project",
      entity_id: "prj-nyc-01",
      entity_name: "NYC-01 Data Center Cluster",
      changes: {
        before: { status: "Provisioning", count: 24 },
        after: { status: "In Service", count: 24 }
      },
      causer: {
        name: "Marcus Aurelius",
        email: "marcus@tracerpro.com",
        avatar: "MA"
      }
    },
    {
      id: "ntf-4",
      type: "system",
      action: "billing_limit",
      title: "Subscription Warning: Limit Approaching",
      description: "Organization has reached **85%** of the allocated scan limits under the current Pro Plan.",
      priority: "warning",
      isRead: false,
      isArchived: false,
      created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
      entity_type: "billing",
      causer: {
        name: "TracerPro System",
        email: "billing@tracerpro.com"
      }
    },
    {
      id: "ntf-5",
      type: "assets",
      action: "asset_retired",
      title: "Asset Retired from Inventory",
      description: "Asset **SRV-DELL-909** was set to status **Retired** due to hardware failure.",
      priority: "warning",
      isRead: true,
      isArchived: false,
      created_at: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
      entity_type: "asset",
      entity_id: "SRV-DELL-909",
      entity_name: "Dell PowerEdge R750",
      changes: {
        before: { status: "Maintenance", health: "Warning" },
        after: { status: "Retired", health: "Critical Failure" }
      },
      causer: {
        name: "Sarah Jenkins",
        email: "sarah@tracerpro.com",
        avatar: "SJ"
      }
    }
  ];
  ```

- [ ] **Step 2: Commit changes**
  ```bash
  git add components/dashboard/notifications/mock-data.ts
  git commit -m "feat(notifications): add mock data and types"
  ```

---

### Task 2: Implement Header, Filter and Details Components

**Files:**
- Create: `components/dashboard/notifications/notifications-header.tsx`
- Create: `components/dashboard/notifications/notifications-filter.tsx`
- Create: `components/dashboard/notifications/notification-details-dialog.tsx`

- [ ] **Step 1: Create notifications-header.tsx**
  Implement the header component with stats indicators and bulk triggers.
  ```tsx
  "use client";

  import { Card, CardContent } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Bell, Eye, Trash2 } from "lucide-react";
  import { NotificationItem } from "./mock-data";

  interface HeaderProps {
    notifications: NotificationItem[];
    onMarkAllAsRead: () => void;
    onClearAllRead: () => void;
  }

  export function NotificationsHeader({
    notifications,
    onMarkAllAsRead,
    onClearAllRead,
  }: HeaderProps) {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const critical = notifications.filter((n) => n.priority === "critical" && !n.isRead).length;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Monitor updates, team activity, and critical events in your organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              disabled={unread === 0}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllRead}
              disabled={notifications.filter((n) => n.isRead).length === 0}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear read
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/40 backdrop-blur-xs border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Events</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{total}</h3>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 backdrop-blur-xs border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unread Messages</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{unread}</h3>
              </div>
              <div className={`p-2 rounded-lg ${unread > 0 ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>
                <Bell className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 backdrop-blur-xs border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Critical Alerts</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{critical}</h3>
              </div>
              <div className={`p-2 rounded-lg ${critical > 0 ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"}`}>
                <Bell className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create notifications-filter.tsx**
  Implement filters for category tabs, search input, and priority drop-downs.
  ```tsx
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
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Priority: </span>
                <span className="font-semibold capitalize">{priorityFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border-border">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={priorityFilter} onValueChange={setPriorityFilter}>
                <DropdownMenuRadioItem value="all">All Priorities</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="info">Info</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="warning">Warning</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="critical">Critical</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 3: Create notification-details-dialog.tsx**
  Implement the detail dialog detailing changes and properties.
  ```tsx
  "use client";

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import { ArrowRight, Clock, ShieldAlert, Sparkles, User, Settings } from "lucide-react";
  import { NotificationItem } from "./mock-data";

  interface DetailsProps {
    notification: NotificationItem | null;
    isOpen: boolean;
    onClose: () => void;
  }

  export function NotificationDetailsDialog({
    notification,
    isOpen,
    onClose,
  }: DetailsProps) {
    if (!notification) return null;

    const formattedTime = new Date(notification.created_at).toLocaleString();

    // Map Category Icon
    const getCategoryIcon = () => {
      switch (notification.type) {
        case "security":
          return <ShieldAlert className="h-5 w-5 text-red-500" />;
        case "organization":
          return <User className="h-5 w-5 text-emerald-500" />;
        case "assets":
          return <Sparkles className="h-5 w-5 text-blue-500" />;
        default:
          return <Settings className="h-5 w-5 text-purple-500" />;
      }
    };

    const isAuditUpdate = !!(notification.changes?.before && notification.changes?.after);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg bg-background border-border text-foreground">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted border border-border">
                {getCategoryIcon()}
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  notification.priority === "critical"
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : notification.priority === "warning"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                }`}>
                  {notification.priority}
                </span>
              </div>
            </div>
            <DialogTitle className="text-xl font-bold">{notification.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Clock className="h-3.5 w-3.5" />
              {formattedTime}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Description */}
            <div
              className="text-sm leading-relaxed text-foreground/90 bg-muted/20 p-4 rounded-lg border border-border/50"
              dangerouslySetInnerHTML={{
                __html: notification.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />

            {/* Causer/Actor Profile */}
            {notification.causer && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Triggered By</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/10">
                  <Avatar className="h-9 w-9 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/5 text-primary text-xs font-bold">
                      {notification.causer.avatar || notification.causer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold text-foreground">{notification.causer.name}</span>
                    <span className="text-xs text-muted-foreground">{notification.causer.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Log / Changes */}
            {isAuditUpdate && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property Changes</h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="px-4 py-2 font-medium">Property</th>
                        <th className="px-4 py-2 font-medium">Previous Value</th>
                        <th className="px-4 py-2 font-medium">Updated Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.keys(notification.changes!.before!).map((key) => (
                        <tr key={key} className="hover:bg-muted/20">
                          <td className="px-4 py-2 font-mono font-medium text-foreground">{key}</td>
                          <td className="px-4 py-2 text-muted-foreground line-through">
                            {String(notification.changes!.before![key])}
                          </td>
                          <td className="px-4 py-2 text-emerald-500 font-semibold flex items-center gap-1.5">
                            <ArrowRight className="h-3.5 w-3.5" />
                            {String(notification.changes!.after![key])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="ghost" onClick={onClose}>
              Dismiss
            </Button>
            {notification.entity_id && (
              <Button className="flex items-center gap-1.5" onClick={() => {
                alert(`Navigate to entity: ${notification.entity_type} -> ${notification.entity_id}`);
                onClose();
              }}>
                Inspect Resource
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add components/dashboard/notifications/notifications-header.tsx components/dashboard/notifications/notifications-filter.tsx components/dashboard/notifications/notification-details-dialog.tsx
  git commit -m "feat(notifications): implement header, filter, and detail dialog components"
  ```

---

### Task 3: Implement Item and Orchestrator Components

**Files:**
- Create: `components/dashboard/notifications/notification-item.tsx`
- Create: `components/dashboard/notifications/notifications-list.tsx`

- [ ] **Step 1: Create notification-item.tsx**
  Implement individual notification items with visual indicators and hover actions.
  ```tsx
  "use client";

  import { NotificationItem } from "./mock-data";
  import { Card, CardContent } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    CheckCircle,
    Circle,
    Eye,
    ShieldAlert,
    Sparkles,
    User,
    Settings,
    Trash2,
    Calendar,
  } from "lucide-react";

  interface ItemProps {
    notification: NotificationItem;
    onToggleRead: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (item: NotificationItem) => void;
  }

  export function NotificationItemCard({
    notification,
    onToggleRead,
    onDelete,
    onSelect,
  }: ItemProps) {
    // Relative date formatter
    const getRelativeTime = (isoString: string) => {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    };

    // Icon setup
    const getIconConfig = () => {
      const base = "h-4 w-4";
      switch (notification.type) {
        case "security":
          return {
            element: <ShieldAlert className={base} />,
            bg: "bg-red-500/10 text-red-500 border border-red-500/20",
          };
        case "organization":
          return {
            element: <User className={base} />,
            bg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
          };
        case "assets":
          return {
            element: <Sparkles className={base} />,
            bg: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
          };
        default:
          return {
            element: <Settings className={base} />,
            bg: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
          };
      }
    };

    const icon = getIconConfig();

    return (
      <Card
        onClick={() => onSelect(notification)}
        className={`group relative border-border/60 overflow-hidden cursor-pointer transition-all duration-300 hover:bg-muted/40 hover:border-primary/20 ${
          notification.isRead ? "bg-card/20 opacity-75" : "bg-card/85 shadow-sm border-l-4 border-l-primary"
        }`}
      >
        <CardContent className="p-4 flex gap-4">
          {/* Icon Badge */}
          <div className="flex-shrink-0 mt-0.5">
            <div className={`p-2.5 rounded-lg ${icon.bg}`}>
              {icon.element}
            </div>
          </div>

          {/* Center Details */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-2">
              <h4 className={`text-sm truncate text-foreground ${notification.isRead ? "font-medium" : "font-semibold"}`}>
                {notification.title}
              </h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize font-semibold ${
                notification.priority === "critical"
                  ? "bg-red-500/15 text-red-500 border border-red-500/10"
                  : notification.priority === "warning"
                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/10"
                  : "bg-blue-500/15 text-blue-500 border border-blue-500/10"
              }`}>
                {notification.priority}
              </span>
            </div>

            <p
              className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: notification.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />

            <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getRelativeTime(notification.created_at)}
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider">{notification.type}</span>
            </div>
          </div>

          {/* Action Column on hover */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/95 border border-border/40 p-1 rounded-lg shadow-md z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
              title={notification.isRead ? "Mark as unread" : "Mark as read"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(notification.id);
              }}
            >
              {notification.isRead ? <Circle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Delete Notification"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  ```

- [ ] **Step 2: Create notifications-list.tsx**
  Implement list orchestrator combining state management (LocalStorage) and filters.
  ```tsx
  "use client";

  import { useState, useEffect } from "react";
  import { INITIAL_NOTIFICATIONS, NotificationItem } from "./mock-data";
  import { NotificationsHeader } from "./notifications-header";
  import { NotificationsFilter } from "./notifications-filter";
  import { NotificationItemCard } from "./notification-item";
  import { NotificationDetailsDialog } from "./notification-details-dialog";
  import { Card, CardContent } from "@/components/ui/card";
  import { BellOff, RefreshCw } from "lucide-react";
  import { Button } from "@/components/ui/button";

  const STORAGE_KEY = "tracerpro_notifications_v1";

  export function NotificationsList() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Initial state loading
    useEffect(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch {
          setNotifications(INITIAL_NOTIFICATIONS);
        }
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    }, []);

    // Save helpers
    const saveState = (updated: NotificationItem[]) => {
      setNotifications(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Actions
    const handleToggleRead = (id: string) => {
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, isRead: !n.isRead } : n
      );
      saveState(updated);
    };

    const handleDelete = (id: string) => {
      const updated = notifications.filter((n) => n.id !== id);
      saveState(updated);
      if (selectedNotification?.id === id) {
        setDetailsOpen(false);
      }
    };

    const handleMarkAllAsRead = () => {
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      saveState(updated);
    };

    const handleClearAllRead = () => {
      const updated = notifications.filter((n) => !n.isRead);
      saveState(updated);
    };

    const handleReset = () => {
      saveState(INITIAL_NOTIFICATIONS);
    };

    // Filter Logic
    const filtered = notifications.filter((n) => {
      // Search matches
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase()) ||
        (n.user_name && n.user_name.toLowerCase().includes(search.toLowerCase())) ||
        (n.causer?.name && n.causer.name.toLowerCase().includes(search.toLowerCase()));

      // Tab filter
      let matchesTab = true;
      if (activeTab === "unread") matchesTab = !n.isRead;
      else if (activeTab !== "all") matchesTab = n.type === activeTab;

      // Priority filter
      const matchesPriority = priorityFilter === "all" || n.priority === priorityFilter;

      return matchesSearch && matchesTab && matchesPriority;
    });

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <NotificationsHeader
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAllRead={handleClearAllRead}
        />

        <NotificationsFilter
          search={search}
          setSearch={setSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        {/* List Grid */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <NotificationItemCard
                key={item.id}
                notification={item}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
                onSelect={(n) => {
                  // Mark as read immediately on click if it was unread
                  if (!n.isRead) {
                    handleToggleRead(n.id);
                  }
                  setSelectedNotification(n);
                  setDetailsOpen(true);
                }}
              />
            ))
          ) : (
            <Card className="border-dashed border-2 border-border/80 bg-card/10">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="p-4 rounded-full bg-muted/40 text-muted-foreground mb-4">
                  <BellOff className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground">No notifications found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  There are no updates matching your search queries or filter categories.
                </p>
                <div className="flex gap-2 mt-6">
                  {(search || activeTab !== "all" || priorityFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setActiveTab("all");
                        setPriorityFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={handleReset} className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset Initial Mock List
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Audit Details Modal */}
        <NotificationDetailsDialog
          notification={selectedNotification}
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      </div>
    );
  }
  ```

- [ ] **Step 3: Commit changes**
  ```bash
  git add components/dashboard/notifications/notification-item.tsx components/dashboard/notifications/notifications-list.tsx
  git commit -m "feat(notifications): implement item card and main orchestrator list components"
  ```

---

### Task 4: Modify AppHeader, NavUser, and Render Page

**Files:**
- Modify: `components/sidebar/app-header.tsx`
- Modify: `components/sidebar/nav-user.tsx`
- Modify: `app/dashboard/notifcations/page.tsx`

- [ ] **Step 1: Wire Notifications Link in AppHeader**
  Update `components/sidebar/app-header.tsx` to wrap the notification button in a Link and register the breadcrumb override mapping.
  Lines to edit:
  - Add import: `import Link from "next/link";`
  - Map `notifcations: "Notifications"` in DynamicBreadcrumbs `labelMap` object.
  - Wrap notifications Button with `<Link href="/dashboard/notifcations" passHref>`

  Check code:
  ```tsx
  // ...
  import Link from "next/link";
  // ...
        <DynamicBreadcrumbs
          className="hidden md:flex"
          showHome={false}
          labelMap={{
            dashboard: "Dashboard",
            users: "Users",
            settings: "Settings",
            notifcations: "Notifications",
          }}
        />
  // ...
        {/* Notifications */}

        <Link href="/dashboard/notifcations" passHref legacyBehavior>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />

            {/* Notification Badge */}

            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
        </Link>
  ```

- [ ] **Step 2: Wire Notifications Link in NavUser**
  Modify `components/sidebar/nav-user.tsx` to wrap the "Notifications" dropdown menu option with a standard Next.js Link.
  Lines to edit:
  - Add `<Link href="/dashboard/notifcations" className="flex w-full items-center">` inside `DropdownMenuItem`.

  Check code:
  ```tsx
  // ...
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifcations" className="flex w-full items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
  // ...
  ```

- [ ] **Step 3: Render Notifications Page**
  Modify `/Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/notifcations/page.tsx` to render the newly implemented `NotificationsList` component.
  ```tsx
  import { NotificationsList } from "@/components/dashboard/notifications/notifications-list";

  export default function NotificationsPage() {
    return <NotificationsList />;
  }
  ```

- [ ] **Step 4: Verify Compilation and Commit**
  Run: `pnpm tsc --noEmit` to check for typescript errors.
  Commit:
  ```bash
  git add components/sidebar/app-header.tsx components/sidebar/nav-user.tsx app/dashboard/notifcations/page.tsx
  git commit -m "feat(notifications): wire app header, user menu dropdown, and render notification list page"
  ```

---

### Task 5: Verify Implementation and Visual Cleanliness

- [ ] **Step 1: Check build**
  Run: `pnpm build`
  Expected: Success without TypeScript or build issues.

- [ ] **Step 2: Clean check**
  Run `git status` to ensure working directory is clean.
  Expected: Clean working tree.
