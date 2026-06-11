"use client";

import { NotificationItem } from "./mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
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
        notification.isRead ? "bg-card/20 opacity-75" : "bg-card/85 shadow-xs border-l-4 border-l-primary"
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
