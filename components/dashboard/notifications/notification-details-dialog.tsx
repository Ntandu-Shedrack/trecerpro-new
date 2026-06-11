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
