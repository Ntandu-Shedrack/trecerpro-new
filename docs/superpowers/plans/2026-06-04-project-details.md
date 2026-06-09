# Project Details View Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the project details view page and the overview tab to achieve the requested visual layout, colors, and styling matching the mockup.

**Architecture:** Modify the header/action items in `project-details.tsx` and structure the grids/cards inside `overview-tab.tsx` to match the exact dark-blue navy palette and layout elements of the screenshot.

**Tech Stack:** React, Next.js, Tailwind CSS (v4), Lucide React, Framer Motion.

---

### Task 1: Update Project Details Header and Navigation

**Files:**
- Modify: `components/dashboard/project/project-details.tsx`

- [ ] **Step 1: Edit Folder Icon Container and Badge**
  Modify the folder icon's background and border styling to match a deep dark blue:
  ```tsx
  <div className="h-14 w-14 rounded-2xl bg-[#05162e] border border-[#0b2240] flex items-center justify-center shadow-sm">
    <Folder className="h-7 w-7 text-primary" />
  </div>
  ```
  And replace the active badge styling to match the screenshot (`bg-[#0d2a2c] text-[#4ade80] border-[#0f3d35]` with a pulsing green dot).

- [ ] **Step 2: Update Header Action Buttons**
  Style the "Share" button to be a sleek dark outline `border-[#0b2240] text-foreground bg-transparent hover:bg-muted/10` and the "Edit Details" button as solid blue with a subtle hover state and premium drop-shadow.

- [ ] **Step 3: Align Tabs layout**
  Position the tabs list header alongside the clock icon and "Last activity updated" string, aligned matching the screenshot layout.

- [ ] **Step 4: Commit**
  ```bash
  git add components/dashboard/project/project-details.tsx
  git commit -m "style: redesign project details view header, badge, and buttons"
  ```

---

### Task 2: Redesign Overview Tab Content and Sidebar

**Files:**
- Modify: `components/dashboard/project/overview-tab.tsx`

- [ ] **Step 1: Redesign the Three Metric Cards**
  Update the cards for Categories, Assets, and Stability to use the deep dark-navy background (`bg-[#020b18] border-[#0b2240]`), correct icon colors, and trending subtext "No change this week".

- [ ] **Step 2: Redesign the Tracked Assets Main Card**
  Update the main center asset count status card structure to use a centered icon-ring package visual and a solid blue action button.

- [ ] **Step 3: Update the Project Metadata Sidebar Card**
  Use the metadata card matching the screenshot layout with a clean UUID monospace box.

- [ ] **Step 4: Update the View History Sidebar Card**
  Refine the history card with the correct button action uppercase style and clock background overlay.

- [ ] **Step 5: Commit**
  ```bash
  git add components/dashboard/project/overview-tab.tsx
  git commit -m "style: redesign overview tab layout, metric cards, and sidebar"
  ```
