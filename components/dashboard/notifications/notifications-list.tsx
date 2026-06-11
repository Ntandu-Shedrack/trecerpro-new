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
