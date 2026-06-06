# Design Spec: Projects UI/UX Theme & Visual Improvement

## Goal
Improve the visual styling and layout flow of the projects listing and project details tabs (Overview, Assets, Activity, and Settings) to align with the dynamic OKLCH color theme, removing hardcoded dark deep blue elements and ensuring full responsiveness and light/dark theme compliance.

## Proposed Changes

### 1. Workspace Hub & Grid Layout
- Files: [projects-view.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/projects/projects-view.tsx), [projects-grid.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/projects/projects-grid.tsx)
- Remove outer margins/paddings (`p-8`) to match the main layout wrappers.
- Swap out hardcoded slate styling (`bg-slate-900/50`, `bg-slate-950`, `border-slate-800`) with theme-aware variables (`bg-card/75 backdrop-blur-md`, `border-border/80`).
- Apply primary blue hover highlights and glassmorphic glowing shadows to cards in the grid.

### 2. Project Details Layout & Header
- File: [project-details.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/project-details.tsx)
- Change header icon background from raw dark deep blue (`bg-[#05162e] border border-[#0b2240]`) to `bg-primary/10 border-primary/20`.
- Update tab active styling: transition triggers to `data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20`.
- Replace static action colors (such as `#0070f3` text/bg values) with brand variables (`bg-primary`, `hover:bg-primary/90`).

### 3. Project Overview Tab
- File: [overview-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/overview-tab.tsx)
- Replace deep blue backgrounds (`bg-[#020b18]`, `bg-[#05162e]`, `bg-[#051126]/50`) and borders (`border-[#0b2240]`) with dynamic glassmorphic card designs (`bg-card/75 border-border/80 backdrop-blur-md`).

### 4. Assets Table Redesign
- File: [assets-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/assets-tab.tsx)
- Restyle filter and search forms to use `bg-muted/30 border-border/80 text-foreground`.
- Restyle the inventory table borders and rows from hardcoded slate to `border-border/40 hover:bg-muted/30`.

## Verification Plan

### Automated Checking
- Run `pnpm run build` to guarantee proper React 19 / TypeScript compilation.

### Manual Checking
- Verify color contrast and alignment in light and dark mode toggles.
