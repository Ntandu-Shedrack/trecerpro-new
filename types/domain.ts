export type MemberRole = "owner" | "admin" | "member";
export type ProjectStatus = "active" | "on-hold" | "completed";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  two_factor_confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
  organizations?: Organization[];
  current_organization?: Organization | null;
  currentOrganization?: Organization | null;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  timezone: string;
  locale: string;
  image_url?: string;
  require_join_approval?: boolean;
  join_request_status?: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
  updated_at: string;
  pivot?: { role: string };
}

export interface Membership {
  id: number;
  organization_id: number;
  user_id: number;
  role: MemberRole;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Invitation {
  id: number;
  organization_id: number;
  email: string;
  role: MemberRole;
  token: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type AttributeType = "string" | "number" | "date" | "boolean" | "select";

export interface CategoryAttribute {
  name: string;      // Snake case field key (e.g. "serial_no")
  label: string;     // Friendly UI label (e.g. "Serial Number")
  type: AttributeType;
  required: boolean;
  options?: string[]; // Used when type is 'select'
}

export type Attribute = CategoryAttribute;

export interface Category {
  id: string; // UUID from Laravel HasUuids
  project_id: number;
  name: string;
  description: string | null;
  attributes: CategoryAttribute[]; // JSON cast
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string; // UUID
  project_id: number;
  category_id: string;
  barcode: string;
  values: Record<string, any>; // Dynamic key-values matching the Category attributes schema
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface AssetWithCategory extends Asset {
  category?: Category;
}

export interface Activity {
  id: number;
  project_id: number;
  user_id: number;
  entity_type: string;
  entity_id: string | number;
  entity_name: string;
  action: "created" | "updated" | "deleted" | "imported";
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  } | null;
  created_at: string;
  user?: User;
  user_name?: string; // Client fallback helper
}

// ─── Legacy/Client-side Helper Definitions ──────────────────────────────────
export interface OrgMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
}

export interface OrgInvitation {
  id: string | number;
  email: string;
  role: string;
  status: string;
  created_at?: string;
}

export interface DashboardStats {
  projectCount: number;
  categoryCount: number;
  assetCount: number;
  monthlyGrowth: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  chartData: { name: string; total: number }[];
  categoryDistribution?: { name: string; units: number }[];
  lifecycleDistribution?: { name: string; value: number }[];
  activities: Activity[];
  members: OrgMember[];
}
