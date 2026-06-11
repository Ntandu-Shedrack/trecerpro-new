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
            className="flex items-center gap-2 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllRead}
            disabled={notifications.filter((n) => n.isRead).length === 0}
            className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
