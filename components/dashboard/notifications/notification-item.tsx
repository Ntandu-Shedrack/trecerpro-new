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
  Trash2
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
