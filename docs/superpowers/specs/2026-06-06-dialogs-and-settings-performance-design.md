# Design Spec: Dialog UI/UX Redesign & Category Settings Performance Optimization

## Goal
Optimize the performance of the category settings tab table load by pre-populating with server-fetched data, and improve the visual layout and theme-compliance of the asset creation/edit, bulk upload, and category dialog components using standard OKLCH dynamic tokens.

## Proposed Changes

### 1. Settings Tab Category Loading Performance Optimization
- Files: [project-details.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/project-details.tsx), [settings-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/settings-tab.tsx)
- Pass server-side loaded `initialCategories` from `ProjectDetailsView` down to `SettingsTab`.
- In `SettingsTab`, initialize state with `initialCategories` to completely bypass client-side fetch loading states during initial tab clicks, resulting in instant rendering.

### 2. Dialog Component Theme & Layout Improvements
- Files: [asset-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/asset-dialog.tsx), [bulk-upload-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/bulk-upload-dialog.tsx), [category-dialog.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/category-dialog.tsx)
- Standardize backgrounds (`bg-slate-950` -> `bg-card`, `bg-slate-900` -> `bg-muted/30`).
- Standardize borders (`border-slate-800` -> `border-border/80`).
- Use brand variables (`text-foreground`, `text-muted-foreground`) to guarantee full accessibility in both light and dark mode triggers.

## Verification Plan

### Automated Checking
- Run `pnpm run build` to verify compilation.

### Manual Checking
- Click the "Settings" tab to verify the categories table loads instantly with no client-side loading indicator.
- Open Asset, Bulk Upload, and Category dialogs, verifying text readability and contrast in light and dark modes.
