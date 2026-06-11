# Design Spec: Add Team Members Metric to Dashboard

This specification outlines the addition of a fifth metric card, **Team Members**, to the dashboard overview in TracerPro. This requires introducing a new attribute `memberCount` to the API response, defining the new property in frontend types, updating fallbacks, and updating the UI layout and card styling.

## Proposed Changes

### Backend (Laravel API)

#### [MODIFY] [DashboardController.php](file:///Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/DashboardController.php)
- Fetch `$memberCount = $org->users()->count();` inside the `index` method.
- Return `memberCount` in the `stats` response array.

### Frontend (Next.js Dashboard App)

#### [MODIFY] [domain.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/types/domain.ts)
- Add `memberCount: number;` to the `DashboardStats` interface.

#### [MODIFY] [overview.actions.ts](file:///Users/mbp/Desktop/Code/tracerpro-new/actions/overview.actions.ts)
- Update the default/fallback `stats` objects in `getDashboardSummary` to include `memberCount: 0`.

#### [MODIFY] [page.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/overview/page.tsx)
- Update the default/fallback `stats` object on line 9 to include `memberCount: 0`.

#### [MODIFY] [dashboard-metrics.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/overview/dashboard-metrics.tsx)
- Import `Users` from `lucide-react`.
- Adjust grid container: Change `lg:grid-cols-4` to `lg:grid-cols-5` (or a combination of grid widths) to fit 5 cards nicely.
- Render the new card displaying "Team Members" and `stats.memberCount`.
