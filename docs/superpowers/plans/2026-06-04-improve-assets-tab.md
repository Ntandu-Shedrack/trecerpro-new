# Improve Assets Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Assets Tab component (`components/dashboard/project/assets-tab.tsx`) to match the mockup design, adding dynamic status extraction and high-fidelity dark UI style.

**Architecture:** Helper status-parsing functions will scan dynamic values keys matching `/status|state/i`, returning standardized states which map to specific color classes. The UI will render responsive outline pill badges, rounded icon details, and themed navigation buttons.

**Tech Stack:** React, Tailwind CSS, Lucide icons, Framer Motion.

---

### Task 1: Add Status Parser Helper & Enhance Style Layout

**Files:**
- Modify: `components/dashboard/project/assets-tab.tsx`

- [ ] **Step 1: Write helper function to parse asset status and map semantic colors**
  Add helper mapping for status colors:
  ```typescript
  const getAssetStatusConfig = (values: Record<string, any> = {}) => {
    const statusKey = Object.keys(values).find((k) => /status|state/i.test(k));
    const statusVal = statusKey ? String(values[statusKey]).trim() : "RUNNING";
    const statusUpper = statusVal.toUpperCase();

    let dotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    let textColor = "text-emerald-500";

    if (/stop|inactive|offline|broken|critical|fail/i.test(statusVal)) {
      dotColor = "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      textColor = "text-rose-500";
    } else if (/maintain|pend|warn|pause/i.test(statusVal)) {
      dotColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
      textColor = "text-amber-500";
    }

    return {
      label: statusUpper,
      dotColor,
      textColor,
    };
  };
  ```

- [ ] **Step 2: Update JSX to match the design styling**
  Refactor row columns, badges, controls, search bar, buttons, and custom layout. Ensure the category badge is uppercase with tag icon and outline style, status is below the date, and the layout uses dark-themed boxes.

- [ ] **Step 3: Verify execution by running development build**
  Ensure code compiles without TypeScript errors.
