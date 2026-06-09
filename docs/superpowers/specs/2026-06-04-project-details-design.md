# Project Details View Page Redesign

Upgrade the Project Details View and Overview Tab components to achieve a premium, high-fidelity dark-navy dashboard interface matching the layout, typography, colors, and interactive elements of the provided design mockup.

## Proposed Changes

### Components

#### [MODIFY] [project-details.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/project-details.tsx)
- Upgrade the layout and padding of the main project details container.
- Update the Folder icon box wrapper to use a dark-navy background (`bg-[#05162e] border border-[#0b2240]`) with a folder icon.
- Replace the current active status badge with a custom pill badge `• ACTIVE` featuring a pulsing green dot, styled with a dark green border and background (`bg-[#0d2a2c] text-[#4ade80] border-[#0f3d35]`).
- Redesign the action buttons:
  - **Share**: Outline styled with `border-[#0b2240] text-foreground bg-transparent hover:bg-muted/10`.
  - **Edit Details**: Solid primary blue `bg-[#0070f3] hover:bg-[#0061d5] text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]`.
- Update the Tabs header:
  - Tabs list header with a bottom border separating navigation from page content.
  - Position the "Last activity updated" text with a clock icon on the right side of the tabs list.

#### [MODIFY] [overview-tab.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dashboard/project/overview-tab.tsx)
- Redesign the layout grid (8 cols for stats/main card, 4 cols for sidebar info).
- Style the three top metric cards (Categories, Assets, Stability):
  - Deep dark blue backgrounds (`bg-[#020b18] border-[#0b2240]`).
  - Icons and color accents: Categories (blue `#0070f3`), Assets (purple/indigo), Stability (emerald green).
  - Add trending subtext: "No change this week" with an `ArrowUpRight` icon.
- Style the primary central tracking card:
  - A centered circular background housing a package icon.
  - Large count label "40 Assets Tracked" (dynamic based on project stats).
  - Action button "View All Assets" styled as a solid primary blue button.
- Style the Sidebar metadata section:
  - Card title "PROJECT METADATA" in small tracking-wider uppercase format.
  - Display Created and Updated dates alongside calendar/clock icons.
  - Monospace text block containing the project's Reference ID (`bg-[#051126]/50 border border-[#0b2240] text-muted-foreground font-mono`).
- Style the View History card:
  - Background history/clock icon at the top right.
  - Uppercase blue text button "OPEN AUDIT LOG >".

## Verification Plan

### Automated/Manual Tests
- Build and run the app locally using `pnpm dev`.
- Visually verify that the project header, badge, buttons, tabs, metric cards, and sidebar metadata match the design mockup.
