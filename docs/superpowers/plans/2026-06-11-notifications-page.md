# Notification Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a feature-rich and visually premium Notification Page accessed via the dashboard header and user-nav, showing organization updates, audit results, and system events.

**Architecture:** It uses Next.js Server Actions to interface with Laravel's backend API. If the backend endpoints are unconfigured, it seamlessly falls back to a Client state persistent layer stored in `localStorage` containing realistic pre-seeded data.

**Tech Stack:** React 19, Next.js 16 (App Router), Radix UI (Dialog), Lucide Icons, Tailwind CSS v4, Sonner.

---

### Task 1: Create Server Actions

**Files:**
- Create: `actions/notification.actions.ts`

- [ ] **Step 1: Write the Server Actions with simulated backend integration and mock responses**

Create [notification.actions.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/actions/notification.actions.ts):
```typescript
"use server";

import api from "@/lib/api";
import { Activity } from "@/types";

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: "system" | "security" | "organization" | "asset";
  priority: "info" | "warning" | "critical";
  read: boolean;
  created_at: string;
  link?: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
}

export async function getNotifications(): Promise<{
  data: SystemNotification[];
  error: string | null;
}> {
  try {
    const response = await api.get("/api/notifications");
    return { data: response.data.data as SystemNotification[], error: null };
  } catch (error: any) {
    console.warn("Laravel notifications endpoint failed or is not implemented yet. Falling back to local storage.", error.message);
    return { data: [], error: "fallback_needed" };
  }
}

export async function markAsRead(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.post(`/api/notifications/${id}/read`);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllAsRead(): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.post(`/api/notifications/read-all`);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNotification(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.delete(`/api/notifications/${id}`);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 2: Commit Task 1**

Run:
```bash
git add actions/notification.actions.ts
git commit -m "feat: add notification server actions with fallback detection"
```

---

### Task 2: Create Mock Data File

**Files:**
- Create: `components/dashboard/notifications/mock-data.ts`

- [ ] **Step 1: Write high-fidelity notification mock items for fallback mode**

Create [mock-data.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/mock-data.ts):
```typescript
import { SystemNotification } from "@/actions/notification.actions";

export const INITIAL_MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Critical Security Alert",
    description: "An unidentified mobile client attempted a restricted barcode scan from IP 192.168.1.105.",
    type: "security",
    priority: "critical",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: "notif-2",
    title: "New Batch Upload Completed",
    description: "240 new devices successfully uploaded and verified in the NYC-01 Server Cluster.",
    type: "system",
    priority: "info",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    link: "/dashboard/operations",
  },
  {
    id: "notif-3",
    title: "Project Audit Warning",
    description: "EMEA Quarterly Audit has 12 items flagged as 'missing' or 'needs verification'.",
    type: "asset",
    priority: "warning",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "notif-4",
    title: "Organization Invitation Accepted",
    description: "Sarah Jenkins (s.jenkins@tracerpro.com) has joined the organization as a Manager.",
    type: "organization",
    priority: "info",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "notif-5",
    title: "Asset Status Updated",
    description: "MacBook Pro M2 (TRC-8902) was changed from 'active' to 'maintenance'.",
    type: "asset",
    priority: "info",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
    changes: {
      before: { status: "active", location: "HQ - Floor 3" },
      after: { status: "maintenance", location: "IT Lab" }
    }
  }
];
```

- [ ] **Step 2: Commit Task 2**

Run:
```bash
git add components/dashboard/notifications/mock-data.ts
git commit -m "feat: add high-fidelity mock notifications data"
```

---

### Task 3: Create Notifications Header Component

**Files:**
- Create: `components/dashboard/notifications/notifications-header.tsx`

- [ ] **Step 1: Write header rendering total stats and actions**

Create [notifications-header.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/notifications-header.tsx):
```typescript
"use client";

import { Button } from "@/components/ui/button";
import { CheckCheck, Trash2 } from "lucide-react";

interface NotificationsHeaderProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export function NotificationsHeader({
  unreadCount,
  totalCount,
  onMarkAllRead,
  onClearAll
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border bg-muted/20 p-6 rounded-t-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review security events, team operations, and system alerts.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="cursor-pointer flex items-center gap-1.5"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          disabled={totalCount === 0}
          className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 flex items-center gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit Task 3**

Run:
```bash
git add components/dashboard/notifications/notifications-header.tsx
git commit -m "feat: add notifications header component"
```

---

### Task 4: Create Filters Component

**Files:**
- Create: `components/dashboard/notifications/notifications-filter.tsx`

- [ ] **Step 1: Write filter tabs and search bar component**

Create [notifications-filter.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/notifications-filter.tsx):
```typescript
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
```

- [ ] **Step 2: Commit Task 4**

Run:
```bash
git add components/dashboard/notifications/notifications-filter.tsx
git commit -m "feat: add notification search and tab filters component"
```

---

### Task 5: Create Detail Dialog Component

**Files:**
- Create: `components/dashboard/notifications/notification-details-dialog.tsx`

- [ ] **Step 1: Write rad-ui overlay dialog showing full event payloads**

Create [notification-details-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/notification-details-dialog.tsx):
```typescript
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SystemNotification } from "@/actions/notification.actions";
import { Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NotificationDetailsDialogProps {
  notification: SystemNotification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailsDialog({
  notification,
  isOpen,
  onClose
}: NotificationDetailsDialogProps) {
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-background text-foreground border border-border rounded-lg shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(notification.created_at).toLocaleString()}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              notification.priority === "critical"
                ? "bg-red-500/10 text-red-600 border border-red-500/20"
                : notification.priority === "warning"
                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
            }`}>
              {notification.priority}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {notification.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            {notification.description}
          </DialogDescription>
        </DialogHeader>

        {notification.changes && (
          <div className="my-4 p-4 rounded-lg bg-muted/40 border border-border/80 text-xs">
            <h5 className="font-bold text-foreground mb-2 uppercase tracking-wide text-[10px]">
              Payload Modification Diff
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-red-500 mb-1">Before:</p>
                <pre className="bg-red-500/5 p-2 rounded-md border border-red-500/10 max-h-40 overflow-y-auto font-mono text-[11px]">
                  {JSON.stringify(notification.changes.before, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-emerald-500 mb-1">After:</p>
                <pre className="bg-emerald-500/5 p-2 rounded-md border border-emerald-500/10 max-h-40 overflow-y-auto font-mono text-[11px]">
                  {JSON.stringify(notification.changes.after, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
          {notification.link && (
            <Button asChild size="sm" className="cursor-pointer flex items-center gap-1">
              <Link href={notification.link} onClick={onClose}>
                Go to resource <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Commit Task 5**

Run:
```bash
git add components/dashboard/notifications/notification-details-dialog.tsx
git commit -m "feat: add notification details dialog component with diff rendering"
```

---

### Task 6: Create Notification Item Component

**Files:**
- Create: `components/dashboard/notifications/notification-item.tsx`

- [ ] **Step 1: Write list card representation for single notification**

Create [notification-item.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/notification-item.tsx):
```typescript
"use client";

import { Button } from "@/components/ui/button";
import { SystemNotification } from "@/actions/notification.actions";
import {
  Bell,
  AlertTriangle,
  Users,
  HardDrive,
  Check,
  Eye,
  Trash2,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: SystemNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (notification: SystemNotification) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  onViewDetails
}: NotificationItemProps) {
  // Select Icon
  const getIcon = () => {
    switch (notification.type) {
      case "security":
        return <AlertTriangle className="h-4 w-4" />;
      case "organization":
        return <Users className="h-4 w-4" />;
      case "asset":
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Map Colors
  const getColorStyles = () => {
    if (notification.priority === "critical") {
      return {
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20"
      };
    }
    if (notification.priority === "warning") {
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20"
      };
    }
    return {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20"
    };
  };

  const colors = getColorStyles();

  return (
    <div
      className={`group relative flex items-start justify-between gap-4 p-4 border border-border/50 bg-card/45 hover:bg-card/90 transition-all duration-300 rounded-lg shadow-xs ${
        !notification.read ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={`size-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ring-1 ring-border/20 ${colors.bg} ${colors.text}`}
        >
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm truncate ${!notification.read ? "text-foreground font-bold" : "text-muted-foreground"}`}>
              {notification.title}
            </span>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {notification.description}
          </p>
          <span className="text-[10px] text-muted-foreground/80 mt-2 block">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewDetails(notification)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkRead(notification.id)}
            className="h-7 w-7 text-muted-foreground hover:text-emerald-500 cursor-pointer"
            title="Mark as Read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(notification.id)}
          className="h-7 w-7 text-muted-foreground hover:text-red-500 cursor-pointer"
          title="Delete Notification"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit Task 6**

Run:
```bash
git add components/dashboard/notifications/notification-item.tsx
git commit -m "feat: add individual notification item card component"
```

---

### Task 7: Create Orchestrator (NotificationsList)

**Files:**
- Create: `components/dashboard/notifications/notifications-list.tsx`

- [ ] **Step 1: Write notifications-list orchestration logic**

Create [notifications-list.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/notifications/notifications-list.tsx):
```typescript
"use client";

import { useEffect, useState, startTransition } from "react";
import { SystemNotification, getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/actions/notification.actions";
import { INITIAL_MOCK_NOTIFICATIONS } from "./mock-data";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsFilter } from "./notifications-filter";
import { NotificationItem } from "./notification-item";
import { NotificationDetailsDialog } from "./notification-details-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function NotificationsList() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<SystemNotification | null>(null);

  const fetchItems = () => {
    startTransition(async () => {
      setLoading(true);
      const res = await getNotifications();
      if (res.error === "fallback_needed") {
        const local = localStorage.getItem("tp_notifications");
        if (local) {
          setNotifications(JSON.parse(local));
        } else {
          localStorage.setItem("tp_notifications", JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
          setNotifications(INITIAL_MOCK_NOTIFICATIONS);
        }
      } else if (res.data) {
        setNotifications(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const saveLocalState = (items: SystemNotification[]) => {
    setNotifications(items);
    localStorage.setItem("tp_notifications", JSON.stringify(items));
  };

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      const res = await markAsRead(id);
      if (!res.success) {
        // Fallback
        const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        saveLocalState(updated);
        toast.success("Notification marked as read");
      } else {
        fetchItems();
        toast.success("Notification marked as read");
      }
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const res = await markAllAsRead();
      if (!res.success) {
        // Fallback
        const updated = notifications.map((n) => ({ ...n, read: true }));
        saveLocalState(updated);
        toast.success("All notifications marked as read");
      } else {
        fetchItems();
        toast.success("All notifications marked as read");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotification(id);
      if (!res.success) {
        // Fallback
        const updated = notifications.filter((n) => n.id !== id);
        saveLocalState(updated);
        toast.success("Notification deleted");
      } else {
        fetchItems();
        toast.success("Notification deleted");
      }
    });
  };

  const handleClearAll = () => {
    startTransition(async () => {
      // Direct Clear
      saveLocalState([]);
      toast.success("All notifications cleared");
    });
  };

  // Filter & Search Logic
  const filtered = notifications.filter((item) => {
    // Search filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === "unread") return !item.read;
    if (activeTab === "alerts") return item.priority === "critical" || item.priority === "warning";
    if (activeTab === "system") return item.type === "system";
    if (activeTab === "organization") return item.type === "organization";

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-md shadow-md max-w-4xl mx-auto">
      <NotificationsHeader
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAll}
      />

      <NotificationsFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No notifications found matching your selection.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                onViewDetails={(n) => setSelectedNotification(n)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <NotificationDetailsDialog
        notification={selectedNotification}
        isOpen={selectedNotification !== null}
        onClose={() => setSelectedNotification(null)}
      />
    </Card>
  );
}
```

- [ ] **Step 2: Commit Task 7**

Run:
```bash
git add components/dashboard/notifications/notifications-list.tsx
git commit -m "feat: add main notifications list orchestrator component"
```

---

### Task 8: Set Up Page Entries

**Files:**
- Modify: `app/dashboard/notifications/page.tsx`
- Delete: `app/dashboard/notifcations/page.tsx` (removes old typo directory)

- [ ] **Step 1: Implement entry page file pointing to NotificationsList**

Ensure [app/dashboard/notifications/page.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/notifications/page.tsx) matches exactly:
```typescript
import { NotificationsList } from "@/components/dashboard/notifications/notifications-list";

export default function NotificationsPage() {
  return <NotificationsList />;
}
```

- [ ] **Step 2: Delete duplicate typo directory `/dashboard/notifcations`**

Run:
```bash
rm -rf app/dashboard/notifcations
```

- [ ] **Step 3: Commit Task 8**

Run:
```bash
git add app/dashboard/notifications/page.tsx
git rm -rf app/dashboard/notifcations || true
git commit -m "feat: setup clean notifications route page entry and delete typo route directory"
```

---

### Task 9: Wire Up Headers & Navigation Links

**Files:**
- Modify: `components/sidebar/app-header.tsx`
- Modify: `components/sidebar/nav-user.tsx`

- [ ] **Step 1: Link Bell icon button to notification page and add Breadcrumb map**

Modify [app-header.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/sidebar/app-header.tsx) to wrap the Bell button with a Link, and update labelMap configs to display "Notifications":
```typescript
<<<<
      {/* Breadcrumb */}

      <DynamicBreadcrumbs
        className="hidden md:flex"
        showHome={false}
        labelMap={{
          dashboard: "Dashboard",
          users: "Users",
          settings: "Settings",
        }}
      />
====
      {/* Breadcrumb */}

      <DynamicBreadcrumbs
        className="hidden md:flex"
        showHome={false}
        labelMap={{
          dashboard: "Dashboard",
          users: "Users",
          settings: "Settings",
          notifications: "Notifications",
        }}
      />
>>>>
<<<<
      {/* Notifications */}

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />

        {/* Notification Badge */}

        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>
====
      {/* Notifications */}

      <Link href="/dashboard/notifications" passHref legacyBehavior>
        <Button asChild variant="ghost" size="icon" className="relative cursor-pointer">
          <a>
            <Bell className="h-5 w-5" />

            {/* Notification Badge */}

            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </a>
        </Button>
      </Link>
>>>>
```
*(Also add the `Link` import if missing: `import Link from "next/link";`)*

- [ ] **Step 2: Link NavUser dropdown item to notification page**

Modify [nav-user.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/sidebar/nav-user.tsx) to wrap the Bell Notifications dropdown item in a Link:
```typescript
<<<<
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
====
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="flex w-full items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
>>>>
```

- [ ] **Step 3: Commit Task 9**

Run:
```bash
git add components/sidebar/app-header.tsx components/sidebar/nav-user.tsx
git commit -m "feat: link AppHeader bell button and NavUser dropdown to notifications page"
```

---

### Task 10: Build and Lint Validation

**Files:**
- None

- [ ] **Step 1: Check TS and Eslint builds**

Run:
```bash
pnpm lint && npx tsc --noEmit
```
Expected: Clean build with no code checks or layout failures.

- [ ] **Step 2: Commit Task 10**

Run:
```bash
git commit --allow-empty -m "chore: verify build compilation and linting successfully passes"
```
