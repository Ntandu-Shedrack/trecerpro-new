// ─────────────────────────────────────────────────────────────────────────────
// Core domain models for TracerPro
// ─────────────────────────────────────────────────────────────────────────────

// ── User & Auth ───────────────────────────────────────────────────────────────

export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar?: string | null;
  profile_photo_url?: string | null;
  /** 2FA confirmation timestamp */
  two_factor_confirmed_at?: string | null;
  /** Clerk-style primary email accessor (used internally in auth hooks) */
  primaryEmailAddress?: { emailAddress: string } | null;
  /** The currently active organization (snake_case from Laravel) */
  current_organization?: Organization | null;
  /** Alias for current_organization (camelCase variant) */
  currentOrganization?: Organization | null;
  /** All organizations the user belongs to */
  organizations?: Organization[];
  created_at?: string;
  updated_at?: string;
}

// ── Organization ──────────────────────────────────────────────────────────────

export interface Organization {
  id: number | string;
  name: string;
  slug?: string;
  logo?: string | null;
  logo_url?: string | null;
  /** Alias used in some API responses */
  image_url?: string | null;
  /** Whether new join requests require admin approval */
  require_join_approval?: boolean;
  /** Status of the current user's join request, if any */
  join_request_status?: "pending" | "accepted" | "declined" | null;
  role?: string;
  pivot?: {
    role?: string;
    [key: string]: unknown;
  };
  created_at?: string;
  updated_at?: string;
}

export interface OrgMember {
  id: number | string;
  /** Membership / pivot record id */
  membership_id?: number | string;
  user_id?: number | string;
  name: string;
  email: string;
  avatar?: string | null;
  profile_photo_url?: string | null;
  /** Clerk-style image URL alias used in avatar components */
  imageUrl?: string | null;
  role: string;
  joined_at?: string;
  created_at?: string;
}

export interface OrgInvitation {
  id: number | string;
  organization_id?: number | string;
  email: string;
  role: string;
  status?: "pending" | "accepted" | "declined" | "expired";
  token?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ── Project ───────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "on-hold" | "completed";

export interface Project {
  id: number | string;
  organization_id?: number | string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  assets_count?: number;
  categories_count?: number;
  created_at: string;
  updated_at: string;
}

// ── Category & Attributes ─────────────────────────────────────────────────────

export type AttributeType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "textarea"
  | "email"
  | "url";

export interface CategoryAttribute {
  id?: number | string;
  /** Human-readable label shown in forms (may differ from the key `name`) */
  label?: string;
  name: string;
  type: AttributeType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

/** Alias used in some action files */
export type Attribute = CategoryAttribute;

export interface Category {
  id: number | string;
  project_id?: number | string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  attributes: CategoryAttribute[];
  assets_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ── Assets ────────────────────────────────────────────────────────────────────

export interface AssetWithCategory {
  id: number | string;
  project_id?: number | string;
  category_id?: number | string;
  barcode: string;
  status?: string | null;
  /** Dynamic attribute values keyed by attribute name */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: Record<string, any>;
  category?: Category | null;
  created_at?: string;
  updated_at?: string;
}

// ── Activity ──────────────────────────────────────────────────────────────────

export interface Activity {
  id: number | string;
  organization_id?: number | string;
  project_id?: number | string;
  user_id?: number | string;
  type?: string;
  action?: string;
  description?: string;
  subject_type?: string;
  subject_id?: number | string;
  /** The display name of the user who performed the action */
  user_name?: string;
  /** The human-readable name of the affected entity */
  entity_name?: string;
  /** The type of the affected entity (e.g. 'asset', 'category', 'project') */
  entity_type?: string;
  /** Diff data for updated events */
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  causer?: {
    id?: number | string;
    name?: string;
    email?: string;
    avatar?: string | null;
    profile_photo_url?: string | null;
  } | null;
  properties?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  projectCount: number;
  categoryCount: number;
  assetCount: number;
  memberCount: number;
  monthlyGrowth: number;
}

export interface DashboardChartPoint {
  name: string;
  total: number;
}

export interface DashboardCategoryItem {
  name: string;
  value: number;
  /** Total units — used as the primary dataKey by the Asset Distribution area chart */
  units: number;
  color?: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  chartData: DashboardChartPoint[];
  /** Per-category asset distribution */
  categoryDistribution?: DashboardCategoryItem[];
  /** Asset lifecycle status distribution */
  lifecycleDistribution?: DashboardCategoryItem[];
  activities: Activity[];
  members: OrgMember[];
}
