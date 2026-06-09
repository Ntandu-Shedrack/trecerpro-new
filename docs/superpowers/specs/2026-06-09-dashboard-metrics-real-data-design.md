# Dashboard Metrics Real Data Integration

Integration of real organization statistics into the TracerPro dashboard overview, switching from static dummy cards to live counts.

## Context

The main dashboard overview page (`/dashboard/overview`) currently displays dummy metrics for:
- Total Assets
- Asset Categories
- Verified Assets
- Monthly Growth

We are updating the dashboard to fetch real organization data from the Laravel backend, starting with:
1. **Total Projects**
2. **Total Categories**
3. **Total Assets**
4. **Monthly Growth**

## Proposed Changes

### Laravel Backend (`tracepro-laravel`)

#### [NEW] `app/Http/Controllers/DashboardController.php`
A new controller that returns the stats, activity feed, and member count of the active organization context.
- Retrieves current organization via `$request->user()->activeOrganization`.
- Computes:
  - `projectCount`: Total projects in organization.
  - `categoryCount`: Total categories across all projects in organization.
  - `assetCount`: Total assets across all projects in organization.
  - `monthlyGrowth`: Asset growth in the current month compared to previous months. Formula:
    $$\text{growth} = \frac{\text{Assets created in current month}}{\text{Total assets created before current month}} \times 100$$
    If pre-existing assets is 0, but current month additions > 0, growth defaults to 100.0. Otherwise 0.0.
- Computes `chartData` for the past 6 months (asset creation counts).
- Retrieves the latest 10 activities and organization members.

#### [MODIFY] `routes/api.php`
- Add route `GET /api/dashboard` mapped to `DashboardController@index` under the `org.selected` middleware group.

---

### Next.js Frontend (`tracerpro-new`)

#### [MODIFY] `types/domain.ts`
- Update `DashboardStats` interface to include `monthlyGrowth` and update fields:
  ```typescript
  export interface DashboardStats {
    projectCount: number;
    categoryCount: number;
    assetCount: number;
    monthlyGrowth: number;
  }
  ```

#### [MODIFY] `actions/overview.actions.ts`
- Ensure `getDashboardSummary` properly passes `monthlyGrowth` stats through.

#### [MODIFY] `app/dashboard/overview/page.tsx`
- Convert the component to a Server Component that fetches the real stats server-side.
- Render `<DashboardMetrics stats={stats} />` passing the fetched stats.

#### [MODIFY] `components/dashboard/overview/dashboard-metrics.tsx`
- Accept `stats` as a prop.
- Render the cards in order: Total Projects, Total Categories, Total Assets, Monthly Growth.
- Apply modern typography, vibrant colors, hover effects, and appropriate Lucide icons.
