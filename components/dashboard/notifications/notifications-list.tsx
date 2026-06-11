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
                    className="cursor-pointer"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={handleReset} className="flex items-center gap-1.5 cursor-pointer">
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
