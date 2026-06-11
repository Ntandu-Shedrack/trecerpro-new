# Add Team Members Metric to Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fifth card to the dashboard metrics showing the total count of registered members in the active organization.

**Architecture:** Retrieve member count on the Laravel backend via Eloquent, include it in the `/api/dashboard` payload under `stats`, update Next.js Types/Actions, and render a new card inside the metrics grid using Lucide's `Users` icon.

**Tech Stack:** Laravel, React, Next.js, Tailwind CSS, Lucide React

---

### Task 1: Update Laravel Backend API

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/DashboardController.php`

- [ ] **Step 1: Retrieve member count and append to JSON response**

Modify the `index` method in `DashboardController.php` to calculate and return `memberCount`.

Lines to change (around line 28-32):
```php
        // Count projects, categories, and assets
        $projectCount = $org->projects()->count();
        $categoryCount = $org->categories()->count();
        $assetCount = $org->assets()->count();
        $memberCount = $org->users()->count();
```

And in the returned JSON array (around line 114):
```php
        return response()->json([
            'stats' => [
                'projectCount' => $projectCount,
                'categoryCount' => $categoryCount,
                'assetCount' => $assetCount,
                'memberCount' => $memberCount,
                'monthlyGrowth' => $monthlyGrowth,
            ],
            // ...
        ]);
```

- [ ] **Step 2: Verify Laravel local API works**

Execute a request to the local backend using curl to verify the new attribute `memberCount` is present in the `stats` response.
Run:
```bash
curl -s http://127.0.0.1:8000/api/dashboard -H "Accept: application/json"
```
*(Note: If auth is required, we can verify it loads in browser once frontend is updated, or check log files.)*

- [ ] **Step 3: Commit backend changes**

Run:
```bash
cd /Users/mbp/Desktop/Code/tracepro-laravel
git add app/Http/Controllers/DashboardController.php
git commit -m "feat: add memberCount to dashboard API response"
```

---

### Task 2: Update Frontend Types, Actions and Page Fallbacks

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/types/domain.ts`
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/actions/overview.actions.ts`
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/overview/page.tsx`

- [ ] **Step 1: Update type definition in domain.ts**

Modify `DashboardStats` in `types/domain.ts` (around line 185-190):
```typescript
export interface DashboardStats {
  projectCount: number;
  categoryCount: number;
  assetCount: number;
  memberCount: number;
  monthlyGrowth: number;
}
```

- [ ] **Step 2: Add fallback values in overview.actions.ts**

Modify `actions/overview.actions.ts` (around line 21-26 and line 42):
```typescript
      stats: data.stats ?? {
        projectCount: 0,
        categoryCount: 0,
        assetCount: 0,
        memberCount: 0,
        monthlyGrowth: 0,
      },
```
and
```typescript
        stats: { projectCount: 0, categoryCount: 0, assetCount: 0, memberCount: 0, monthlyGrowth: 0 },
```

- [ ] **Step 3: Add fallback values in page.tsx**

Modify `app/dashboard/overview/page.tsx` (around line 9-14):
```typescript
  const stats = data?.stats ?? {
    projectCount: 0,
    categoryCount: 0,
    assetCount: 0,
    memberCount: 0,
    monthlyGrowth: 0,
  };
```

- [ ] **Step 4: Commit types and action changes**

Run:
```bash
cd /Users/mbp/Desktop/Code/tracerpro-new
git add types/domain.ts actions/overview.actions.ts app/dashboard/overview/page.tsx
git commit -m "refactor: update DashboardStats types and fallbacks with memberCount"
```

---

### Task 3: Render Fifth Metrics Card in Component

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/overview/dashboard-metrics.tsx`

- [ ] **Step 1: Import Users icon**

Modify imports in `components/dashboard/overview/dashboard-metrics.tsx` to include `Users` from `lucide-react`.

- [ ] **Step 2: Adjust grid width and add Team Members card**

Modify the layout grid from `lg:grid-cols-4` to `lg:grid-cols-5` (around line 22).

Add the Team Members card.
Here is the code replacement (around line 108):
```tsx
      {/* Team Members */}
      <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Team Members
          </p>

          <h3 className="text-2xl font-bold mt-1 text-foreground">
            {stats.memberCount.toLocaleString()}
          </h3>
        </CardContent>
      </Card>
```

- [ ] **Step 3: Verify build**

Run:
```bash
pnpm build
```
Ensure there are no TypeScript or compilation errors.

- [ ] **Step 4: Commit UI changes**

Run:
```bash
git add components/dashboard/overview/dashboard-metrics.tsx
git commit -m "feat: add Team Members metrics card to dashboard"
```
