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
