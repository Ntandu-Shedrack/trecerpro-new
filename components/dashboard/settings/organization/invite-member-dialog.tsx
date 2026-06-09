"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MailPlus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { inviteOrganizationMember } from "@/actions/organization.actions";

interface InviteMemberDialogProps {
  organizationId: string;
  onInvited?: () => void;
  children: React.ReactNode;
}

export function InviteMemberDialog({
  organizationId,
  onInvited,
  children,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"org:member" | "org:admin">("org:member");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && open) {
      onInvited?.();
    }
    setOpen(nextOpen);
    if (!nextOpen) {
      setEmail("");
      setRole("org:member");
      setSuccess(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    const { error } = await inviteOrganizationMember(organizationId, email, role);
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    toast.success(`Invitation sent to ${email}`);
    setLoading(false);
    setTimeout(() => handleOpenChange(false), 1200);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MailPlus className="h-5 w-5 text-primary" />
            Invite team member
          </DialogTitle>
          <DialogDescription>
            Send an email invitation to join your organization.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="text-sm font-medium">Invitation sent!</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Role</Label>
              <div className="flex flex-col gap-2">
                {[
                  {
                    value: "org:member" as const,
                    title: "Member",
                    description: "Can view and manage assets they have access to. Cannot manage settings, members, or billing.",
                  },
                  {
                    value: "org:admin" as const,
                    title: "Admin",
                    description: "Full access to settings, members, categories, and all projects within the organization.",
                  },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3 text-left transition-all hover:bg-muted/50",
                      role === r.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-muted"
                    )}
                  >
                    <span className="font-semibold text-sm text-foreground">{r.title}</span>
                    <span className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!isValidEmail || loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send invitation
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
