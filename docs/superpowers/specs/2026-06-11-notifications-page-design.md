# Notifications Page Design Specification

Implement a premium, interactive notification system in TracerPro. This allows users to track organizational modifications, security/audit events, and project changes. It operates via Server Actions, querying the Laravel backend where available, and seamlessly falling back to high-fidelity localized client storage (with `localStorage` persistence) when backend endpoints are missing or offline.

## User Review Required

> [!NOTE]
> The notification page will be accessible via both the **User Navigation Dropdown** (User Nav) and the **App Header Notification Bell**.
> Since the Laravel API might not have dedicated tables or endpoints for notifications yet, the system is designed to automatically fall back to simulated client-side storage populated with premium mock records. Updates (marking read, deleting) will be stored in `localStorage` in fallback mode so that they persist correctly.

## Proposed Changes

### Component Architecture

```
app/dashboard/notifications/
  └── page.tsx                         # Page entry rendering <NotificationsList />
components/dashboard/notifications/
  ├── mock-data.ts                     # Pre-populated high-quality events
  ├── notifications-list.tsx           # Main container component (filtering, list wrapper)
  ├── notification-item.tsx            # Single notification card component
  ├── notifications-filter.tsx         # Tab filter & search components
  ├── notifications-header.tsx         # Header component with "Mark all as read" & stats
  └── notification-details-dialog.tsx  # Detailed popup for inspectable events (diffs)
actions/
  └── notification.actions.ts          # Server actions interfacing with Laravel endpoints
```

---

### Component Specifications

#### 1. `mock-data.ts`
Holds a list of realistic event objects containing:
*   `id`: unique string/number
*   `title`: Event summary
*   `description`: Human-readable context
*   `type`: `'system' | 'security' | 'organization' | 'asset'`
*   `priority`: `'info' | 'warning' | 'critical'`
*   `read`: boolean
*   `created_at`: Date string
*   `link`: optional target URL (e.g. `/dashboard/projects/12`)
*   `changes`: optional diff metadata for category or asset changes (before/after objects)

#### 2. `notifications-list.tsx`
Handles the core states:
*   `notifications`: Array of active items
*   `searchQuery`: string for matching title or description
*   `activeTab`: `'all' | 'unread' | 'alerts' | 'system' | 'organization'`
*   `selectedNotification`: for opening the detail dialog
*   Functions: `handleMarkRead(id)`, `handleMarkAllRead()`, `handleDelete(id)`.

#### 3. `notification-item.tsx`
Renders using Lucide icons depending on the type and priority:
*   `warning` / `critical` -> Amber / Red warning shields or exclamation signs.
*   `organization` -> User/Org group icons.
*   `system` -> Server or database icons.
*   Optimistic state indicators (unread dot, hover state, transition on status change).

#### 4. `notification-details-dialog.tsx`
Utilizes Radix UI Dialog / Shadcn Dialog to present:
*   Full context description.
*   Interactive JSON comparison or diff table if changes are present.
*   Clickable quick-link to inspect the related asset/project directly.

#### 5. `notification.actions.ts`
Exports async functions:
*   `getNotifications()`
*   `markAsRead(id)`
*   `markAllAsRead()`
*   `deleteNotification(id)`

---

## Verification Plan

### Manual Verification
1. Navigate to `/dashboard/notifications` by clicking the notification bell in the header or the "Notifications" option in the User Profile dropdown.
2. Verify that dynamic breadcrumbs correctly format the path `/dashboard/notifications` as `Notifications` (rather than any typo variant).
3. Test filters (All, Unread, Security, System, Organization) to verify correct subset listings.
4. Run searches in the search bar and verify matching items highlight or filter correctly.
5. Click a notification to open the detail dialog, validating the details display.
6. Click "Mark as Read" and verify the unread count/state updates dynamically.
7. Click "Mark all as read" and inspect the header counter updating to zero.
8. Delete a notification and verify it is permanently removed from the view.
