# Design Spec: Onboarding Flow Theme & Dark Mode Compliance

## Goal
Update the onboarding page layout and its forms/footers to follow the application's global OKLCH color theme, removing hardcoded light-only backgrounds (such as slate and indigo/teal variations) and ensuring full support for both light and dark modes with premium glassmorphic visual styles.

## Proposed Changes

### 1. Onboarding Page Layout
* **File**: `app/onboarding/layout.tsx`
* **Changes**:
  * Swap layout wrapper background from `bg-slate-50` to `bg-background relative overflow-hidden`.
  * Add a subtle, dynamic radial gradient background blob that adjusts nicely to dark and light modes:
    `<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />`

### 2. Onboarding Form UI
* **File**: `components/forms/OnBoardingForm.tsx`
* **Changes**:
  * **Branding & Header**:
    * Swap `text-slate-900` for `text-foreground` on the main page title.
    * Swap `text-slate-500` for `text-muted-foreground` and `text-slate-800` for `text-foreground font-semibold` on page description subtitles.
  * **Card Container styles**:
    * Replace light-mode specific cards style with glassmorphic cards: `bg-card/75 border border-border/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-primary/40 hover:shadow-[0_0_20px_-3px_rgba(19,127,236,0.15)] transition-all duration-300 flex flex-col`.
  * **Create Org Card Header Icon**:
    * Replace `bg-indigo-50 text-indigo-600 border-indigo-100` with standard brand theme: `bg-primary/10 text-primary border border-primary/20`.
  * **Join Org Card Header Icon**:
    * Replace `bg-teal-50 text-teal-600 border-teal-100` with: `bg-teal-500/10 text-teal-500 border border-teal-500/20`.
  * **Form Controls**:
    * Change text labels from `text-slate-700` to `text-foreground/80`.
    * Change inputs from `border-slate-200` to `border-input bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0`.
  * **Suggested Workspaces List**:
    * Outer item: Swap `border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/10` for `border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200`.
    * Initials Avatar: Swap `bg-slate-100 text-slate-700` for `bg-muted text-muted-foreground`.
    * Text colors: Replace `text-slate-800` with `text-foreground` and `text-slate-400` with `text-muted-foreground`.
    * Badges:
      * `Pending Approval`: Swap `bg-amber-50 text-amber-700 border border-amber-200` for `bg-amber-500/10 text-amber-500 border border-amber-500/20`.
      * `Needs Request`: Swap `bg-indigo-50 text-indigo-700 border border-indigo-200` for `bg-primary/10 text-primary border border-primary/20`.
      * `Auto-Join`: Swap `bg-emerald-50 text-emerald-700 border border-emerald-200` for `bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`.
    * Actions Buttons:
      * Standardize to use standard theme variants (`ghost`, `secondary`, `outline`).
  * **Status Footer**:
    * Replace `text-slate-400` and `text-slate-600` with `text-muted-foreground` and `text-foreground/80`.
    * Replace `text-slate-300` with `text-border`.
    * Replace `text-slate-500 hover:text-red-500` with `text-muted-foreground hover:text-destructive`.

### 3. Onboarding Footer
* **File**: `components/sections/onboarding/onboarding-footer.tsx`
* **Changes**:
  * Clean up hardcoded colors to use standard theme variables:
    * Footer text: Change `text-gray-400 dark:text-gray-600` to `text-muted-foreground`.
    * Footer links: Change `hover:text-gray-600 dark:hover:text-gray-300` to `hover:text-foreground transition-colors`.

---

## Verification Plan

### Automated Checking
* Run `pnpm run build` to confirm there are no syntax or typescript compilation errors.

### Manual Verification
* Access `/onboarding` in the dev environment.
* Verify responsiveness and design elements.
* Toggle application light and dark theme options to ensure high readability and premium looks.
