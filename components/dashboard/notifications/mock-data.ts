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
