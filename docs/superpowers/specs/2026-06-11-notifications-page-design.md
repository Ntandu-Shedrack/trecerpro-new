# Design Spec: Notifications Page and Modular Components

This design specification details the implementation of a dedicated notifications/activity history page (`app/dashboard/notifcations/page.tsx`) and its corresponding modular components under `components/dashboard/notifications`.

This feature allows users to keep track of critical system alerts, asset operations, organization membership events, and general activities in a highly interactive, responsive, and aesthetically premium manner.

---

## 1. Page and Layout Integration

We will wire the notifications page into the two main navigation points specified by the user:

### 1.1 App Header (`components/sidebar/app-header.tsx`)
- Wrap the existing `Bell` button in a `Link` or add an interactive routing action that redirects to `/dashboard/notifcations`.
- Maintain a dynamic unread count indicator (red badge) based on local notifications state.

### 1.2 User Navigation (`components/sidebar/nav-user.tsx`)
- Wrap the existing "Notifications" dropdown menu item in a `Link` pointing to `/dashboard/notifcations`.

### 1.3 Breadcrumb Translation (`components/sidebar/app-header.tsx`)
- In `app-header.tsx`, map the route segment `notifcations` to the user-friendly title `"Notifications"` inside the `DynamicBreadcrumbs` `labelMap` object so that the breadcrumb correctly reads "Dashboard > Notifications" instead of displaying the folder typo.

---

## 2. Modular Component Details

All components will be created under `components/dashboard/notifications`:

### 2.1 `notifications-header.tsx`
- **Responsibilities**:
  - Displays the page title ("Notifications") and subtitle.
  - Renders 3 mini summary cards:
    1. **Total Notifications** (total count).
    2. **Unread** (count of unread notifications, highlighted in brand colors).
    3. **Critical Alerts** (count of notifications with `priority === "critical"`, highlighted in orange/red).
  - Contains bulk action buttons: "Mark all as read" and "Clear all archived".

### 2.2 `notifications-filter.tsx`
- **Responsibilities**:
  - Search bar input matching titles, descriptions, and user names.
  - A tab-strip filtering by category: `All`, `Unread`, `Assets`, `Security`, `Organization`, `System`.
  - A priority filter selector (dropdown menu matching `All`, `Info`, `Warning`, `Critical`).

### 2.3 `notification-item.tsx`
- **Responsibilities**:
  - Renders a single notification card with a modern, glassmorphic layout.
  - Highlights the unread state with an left border accent and semi-bold text.
  - Maps categories to descriptive `lucide-react` icons (e.g. `FilePlus` for asset addition, `UserCheck` for organization invites, `ShieldAlert` for security issues).
  - Displays metadata: Relative time, causer/user avatar, and category pill.
  - Hosts hover controls: Check icon to toggle Read/Unread, Archive/Delete icon, and a button to view details.

### 2.4 `notification-details-dialog.tsx`
- **Responsibilities**:
  - Opens a Dialog showing full details of a clicked notification.
  - Renders detailed properties:
    - **Triggered By**: Causer avatar, name, and email.
    - **Entity details**: Specific asset SKU, project context, or invite details.
    - **Changes/State**: A table-based format showcasing "Property", "Before value", and "After value" for update operations.
    - **Action**: Provides an actionable primary button to navigate to the related record (e.g. `View Asset`, `View Project`).

### 2.5 `notifications-list.tsx`
- **Responsibilities**:
  - Acts as the state coordinator.
  - Initialized with realistic mock notification data containing varied types, dates, priorities, and changes.
  - Integrates with `localStorage` to persist read, archived, and deleted states so the user has an interactive, real-time experience.
  - Performs local search, categorization, and filter queries.
  - Implements smooth layout animation transitions (using framer-motion if installed, or CSS transitions).
  - Displays a clean empty state with a search/inbox-empty icon and a "Clear filters" suggestion.

---

## 3. Mock Data Structure

Notifications will conform to the following TypeScript interface (extending or mirroring the domain `Activity` type):

```typescript
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
```

---

## 4. Proposed File Checklist

### [NEW]
- `components/dashboard/notifications/notifications-header.tsx`
- `components/dashboard/notifications/notifications-filter.tsx`
- `components/dashboard/notifications/notification-item.tsx`
- `components/dashboard/notifications/notification-details-dialog.tsx`
- `components/dashboard/notifications/notifications-list.tsx`

### [MODIFY]
- `components/sidebar/app-header.tsx` (wire bell, add breadcrumb map)
- `components/sidebar/nav-user.tsx` (wire drop-down item)
- `app/dashboard/notifcations/page.tsx` (render `NotificationsList` container)
