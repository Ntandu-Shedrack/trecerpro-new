# Dashboard Metrics Real Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fetch real dashboard overview statistics from the Laravel API backend and display them on the Next.js overview page.

**Architecture:** Create a new `/api/dashboard` Laravel endpoint under `org.selected` middleware. Update Next.js frontend Server Component `app/dashboard/overview/page.tsx` to fetch dashboard summary, and pass down metrics to `DashboardMetrics` component.

**Tech Stack:** Laravel, Next.js, TypeScript, Axios, Lucide React

---

### Task 1: Create DashboardController on Laravel Backend

**Files:**
- Create: `/Users/mbp/Desktop/Code/tracepro-laravel/app/Http/Controllers/DashboardController.php`

- [ ] **Step 1: Write Laravel Controller**
  Write the controller implementing the index method to fetch stats, monthly growth, past 6-month chart counts, recent activities, and members.
  
  ```php
  <?php

  namespace App\Http\Controllers;

  use App\Http\Resources\ActivityResource;
  use App\Http\Resources\MemberResource;
  use App\Models\Activity;
  use App\Models\Project;
  use Illuminate\Http\JsonResponse;
  use Illuminate\Http\Request;

  class DashboardController extends Controller
  {
      /**
       * Get dashboard metrics and data for the selected organization.
       */
      public function index(Request $request): JsonResponse
      {
          $user = $request->user();
          $org = $user->activeOrganization;

          if (!$org) {
              return response()->json([
                  'message' => 'No active organization selected.'
              ], 403);
          }

          // Count projects, categories, and assets
          $projectCount = $org->projects()->count();
          $categoryCount = $org->categories()->count();
          $assetCount = $org->assets()->count();

          // Calculate monthly growth (Option A)
          $currentMonthCount = $org->assets()
              ->where('assets.created_at', '>=', now()->startOfMonth())
              ->count();

          $previousCount = $org->assets()
              ->where('assets.created_at', '<', now()->startOfMonth())
              ->count();

          if ($previousCount > 0) {
              $monthlyGrowth = round(($currentMonthCount / $previousCount) * 100, 1);
          } elseif ($currentMonthCount > 0) {
              $monthlyGrowth = 100.0;
          } else {
              $monthlyGrowth = 0.0;
          }

          // Fetch chart data for last 6 months (asset creation additions)
          $chartData = [];
          for ($i = 5; $i >= 0; $i--) {
              $monthDate = now()->subMonths($i);
              $monthName = $monthDate->format('M');
              $monthStart = $monthDate->copy()->startOfMonth();
              $monthEnd = $monthDate->copy()->endOfMonth();

              $count = $org->assets()
                  ->where('assets.created_at', '>=', $monthStart)
                  ->where('assets.created_at', '<=', $monthEnd)
                  ->count();

              $chartData[] = [
                  'month' => $monthName,
                  'count' => $count,
              ];
          }

          // Fetch latest 10 activities of organization projects
          $projectIds = $org->projects()->pluck('id');
          $activities = Activity::whereIn('project_id', $projectIds)
              ->with('user')
              ->orderBy('created_at', 'desc')
              ->take(10)
              ->get();

          // Fetch organization members (up to 5 for preview)
          $members = $org->users()->take(5)->get();

          return response()->json([
              'stats' => [
                  'projectCount' => $projectCount,
                  'categoryCount' => $categoryCount,
                  'assetCount' => $assetCount,
                  'monthlyGrowth' => $monthlyGrowth,
              ],
              'chartData' => $chartData,
              'activities' => ActivityResource::collection($activities),
              'members' => MemberResource::collection($members),
          ]);
      }
  }
  ```

---

### Task 2: Register API Route in Laravel

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracepro-laravel/routes/api.php`

- [ ] **Step 1: Register Route**
  Add the route `Route::get('/dashboard', [DashboardController::class, 'index']);` within the `org.selected` group.
  
  ```php
  use App\Http\Controllers\DashboardController;
  ```
  And inside the `org.selected` middleware group:
  ```php
  Route::get('/dashboard', [DashboardController::class, 'index']);
  ```

- [ ] **Step 2: Verify Laravel endpoint**
  Run tests or verify using artisan to check that the route registers successfully.
  Command: `php artisan route:list --path=api/dashboard`
  Expected Output: A table containing `api/dashboard` pointing to `App\Http\Controllers\DashboardController@index`.

---

### Task 3: Update Next.js Frontend Types

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/types/domain.ts:132-136`

- [ ] **Step 1: Update DashboardStats Interface**
  Modify the `DashboardStats` interface to match the backend structure:
  ```typescript
  export interface DashboardStats {
    projectCount: number;
    categoryCount: number;
    assetCount: number;
    monthlyGrowth: number;
  }
  ```

---

### Task 4: Update Overview Server Action

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/actions/overview.actions.ts:20-25`
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/actions/overview.actions.ts:38-40`

- [ ] **Step 1: Update getDashboardSummary Mapper**
  Make sure `monthlyGrowth` is mapped correctly:
  ```typescript
  stats: data.stats ?? {
    projectCount: 0,
    categoryCount: 0,
    assetCount: 0,
    monthlyGrowth: 0,
  },
  ```
  and the error fallback:
  ```typescript
  stats: { projectCount: 0, categoryCount: 0, assetCount: 0, monthlyGrowth: 0 },
  ```

---

### Task 5: Pass Stats from Overview Page

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/app/dashboard/overview/page.tsx`

- [ ] **Step 1: Fetch and pass stats to DashboardMetrics**
  Convert component to an async function, call `getDashboardSummary` and render `<DashboardMetrics stats={stats} />`.
  
  ```tsx
  import { DashboardActivity } from "@/components/dashboard/overview/dashboard-activity";
  import { DashboardInsights } from "@/components/dashboard/overview/dashboard-insights";
  import { DashboardMetrics } from "@/components/dashboard/overview/dashboard-metrics";
  import { DashboardOperations } from "@/components/dashboard/overview/dashboard-operations";
  import { getDashboardSummary } from "@/actions/overview.actions";

  export default async function DashboardOverviewPage() {
    const { data } = await getDashboardSummary("");
    const stats = data?.stats ?? {
      projectCount: 0,
      categoryCount: 0,
      assetCount: 0,
      monthlyGrowth: 0,
    };

    return (
      <div className="space-y-6">
        <DashboardMetrics stats={stats} />
        <DashboardInsights />
        <DashboardActivity />
        <DashboardOperations />
      </div>
    );
  }
  ```

---

### Task 6: Implement DashboardMetrics UI with Real Data

**Files:**
- Modify: `/Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/overview/dashboard-metrics.tsx`

- [ ] **Step 1: Update DashboardMetrics Props and Cards**
  Update `DashboardMetrics` to accept `stats` as a prop and render:
  1. Total Projects
  2. Total Categories
  3. Total Assets
  4. Monthly Growth
  
  Make sure icons and designs feel premium, using correct Lucide icons.
  
  ```tsx
  "use client";

  import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import {
    Package,
    FolderKanban,
    Layers,
    TrendingUp,
    TrendingUpIcon,
    ArrowUpRight,
  } from "lucide-react";
  import { DashboardStats } from "@/types";

  interface DashboardMetricsProps {
    stats: DashboardStats;
  }

  export function DashboardMetrics({ stats }: DashboardMetricsProps) {
    const isGrowthPositive = stats.monthlyGrowth >= 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {/* Total Projects */}
        <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <FolderKanban className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Total Projects
            </p>

            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {stats.projectCount.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        {/* Total Categories */}
        <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Layers className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Total Categories
            </p>

            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {stats.categoryCount.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        {/* Total Assets */}
        <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Total Assets
            </p>

            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {stats.assetCount.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card className="group border-border/80 bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <TrendingUp className="h-5 w-5" />
              </div>

              <Badge
                variant="secondary"
                className={`border-none flex items-center gap-1 ${
                  isGrowthPositive
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                }`}
              >
                {isGrowthPositive ? (
                  <TrendingUpIcon className="h-3 w-3" />
                ) : (
                  <TrendingUpIcon className="h-3 w-3 rotate-180" />
                )}
                {isGrowthPositive ? "+" : ""}
                {stats.monthlyGrowth}%
              </Badge>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Monthly Growth
            </p>

            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {isGrowthPositive ? "+" : ""}
              {stats.monthlyGrowth}%
            </h3>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```
