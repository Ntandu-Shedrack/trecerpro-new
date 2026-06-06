# Design Spec: Dashboard UI/UX Theme & Visual Improvement

## Goal
Improve the dashboard overview UI/UX by aligning it with the application's global OKLCH color schema (featuring a vibrant primary blue `#137fec` / `oklch(0.64 0.21 250)`). This update fixes layouts, removes duplicate spacing, and replaces hardcoded slate colors with theme-aware tokens to ensure full support for both light and dark modes.

## Proposed Changes

### 1. Main Overview Layout & Padding
- Remove outer margins/paddings (`p-8`) from subcomponents to eliminate duplicate padding inside the main dashboard layout wrapper (`p-6`).
- Implement uniform spacing (`space-y-6`) between sections in `app/dashboard/overview/page.tsx`.

### 2. Metrics Cards (`components/dashboard/overview/dashboard-metrics.tsx`)
- Wrap each metric item in a glassmorphic Card container:
  - Background: `bg-card/75 backdrop-blur-md`
  - Border: `border-border/80`
  - Hover Border: `hover:border-primary/40`
  - Hover Shadow: `hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)]`
  - Add smooth transitions on borders and shadows.
- Add micro-animations on Lucide icons (scale up 110% on hover/focus).

### 3. Insights Charts (`components/dashboard/overview/dashboard-insights.tsx`)
- Remove hardcoded dark background and border elements.
- Recharts `PieChart`:
  - Dynamically pass tooltip and text labels matching standard CSS variables (e.g. using `var(--card)` or theme-compatible colors).
  - Use theme-aware progress tracks (`bg-muted`) for the asset distribution bar-charts.

### 4. Scans & Activities Timeline (`components/dashboard/overview/dashboard-activity.tsx`)
- Table styles: Replace raw dark mode colors with `border-border`, headers to `bg-muted/50`, and alternate row hover to `hover:bg-muted/30`.
- Activity Feed:
  - Vertical timeline line styled using `bg-border/60`.
  - Feed items wrapped in theme-aware borders and backgrounds.
- Badge indicators: Use transparent background fills with Tailwind color weights (e.g., `bg-emerald-500/10 text-emerald-500` and dark mode matching variants).

### 5. Regional Distribution Map & Alerts (`components/dashboard/overview/dashboard-operations.tsx`)
- Map overlays: Use backdrop-blur (`bg-card/85 backdrop-blur-md border border-border/80 text-foreground`) to guarantee high readability in light mode.
- Critical Alerts: Replace hardcoded colors with styled Tailwind status colors that adjust gracefully to the background.

## Verification Plan

### Automated Checking
- Run `pnpm run build` to ensure no TypeScript compilation or Tailwind configuration errors are introduced.

### Manual Checking
- Visually test layout responsiveness.
- Toggle between light and dark modes to check text/background contrast.
