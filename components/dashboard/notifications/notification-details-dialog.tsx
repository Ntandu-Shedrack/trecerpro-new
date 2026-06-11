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
          <Button variant="ghost" onClick={onClose} className="cursor-pointer">
            Dismiss
          </Button>
          {notification.entity_id && (
            <Button
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => {
                // In a production app, we would route to the entity page.
                // We'll show a friendly notification or just close.
                onClose();
              }}
            >
              Inspect Resource
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
