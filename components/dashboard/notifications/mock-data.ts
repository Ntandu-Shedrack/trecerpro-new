export interface NotificationItem {
  id: string;
  type: "assets" | "security" | "organization" | "system";
  action: string;
  title: string;
  description: string;
  priority: "info" | "warning" | "critical";
  isRead: boolean;
  isArchived: boolean;
  created_at: string;
  user_name?: string;
  entity_name?: string;
  entity_type?: string;
  entity_id?: string;
  changes?: {
    before?: Record<string, string | number | boolean>;
    after?: Record<string, string | number | boolean>;
  };
  causer?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "ntf-1",
    type: "security",
    action: "failed_scan",
    title: "Unauthorized Scan Attempt",
    description: "An unauthorized device attempted to scan asset **MBP-2026-004** in NYC Cluster.",
    priority: "critical",
    isRead: false,
    isArchived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    entity_type: "asset",
    entity_id: "MBP-2026-004",
    entity_name: "MacBook Pro 16\"",
    causer: {
      name: "Unknown Device (IP: 192.168.1.144)",
      email: "security-alert@tracerpro.com"
    }
  },
  {
    id: "ntf-2",
    type: "organization",
    action: "member_joined",
    title: "New Team Member Joined",
    description: "**Deborah Carter** accepted the invitation to join the organization as **Developer**.",
    priority: "info",
    isRead: false,
    isArchived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    entity_type: "member",
    entity_name: "Deborah Carter",
    causer: {
      name: "Deborah Carter",
      email: "deborah@tracerpro.com",
      avatar: "DC"
    }
  },
  {
    id: "ntf-3",
    type: "assets",
    action: "batch_updated",
    title: "Batch Asset Update Success",
    description: "Successfully updated status to **In Service** for 24 server units in project **NYC-01**.",
    priority: "info",
    isRead: true,
    isArchived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    entity_type: "project",
    entity_id: "prj-nyc-01",
    entity_name: "NYC-01 Data Center Cluster",
    changes: {
      before: { status: "Provisioning", count: 24 },
      after: { status: "In Service", count: 24 }
    },
    causer: {
      name: "Marcus Aurelius",
      email: "marcus@tracerpro.com",
      avatar: "MA"
    }
  },
  {
    id: "ntf-4",
    type: "system",
    action: "billing_limit",
    title: "Subscription Warning: Limit Approaching",
    description: "Organization has reached **85%** of the allocated scan limits under the current Pro Plan.",
    priority: "warning",
    isRead: false,
    isArchived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    entity_type: "billing",
    causer: {
      name: "TracerPro System",
      email: "billing@tracerpro.com"
    }
  },
  {
    id: "ntf-5",
    type: "assets",
    action: "asset_retired",
    title: "Asset Retired from Inventory",
    description: "Asset **SRV-DELL-909** was set to status **Retired** due to hardware failure.",
    priority: "warning",
    isRead: true,
    isArchived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
    entity_type: "asset",
    entity_id: "SRV-DELL-909",
    entity_name: "Dell PowerEdge R750",
    changes: {
      before: { status: "Maintenance", health: "Warning" },
      after: { status: "Retired", health: "Critical Failure" }
    },
    causer: {
      name: "Sarah Jenkins",
      email: "sarah@tracerpro.com",
      avatar: "SJ"
    }
  }
];
