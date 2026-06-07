# Premium Asset Dialogs UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the styling of `AssetDialog` and `BulkUploadDialog` to a premium standard using modern layouts, focus rings, status indicators, and smooth transition animations.

**Architecture:** 
1. Integrate `framer-motion` for spring-based height/fade transitions.
2. Implement custom stepper bars, interactive uploader state variables, and glassmorphism badges.

**Tech Stack:** React, Next.js, Framer Motion, Radix UI

---

### Task 1: Refactor AssetDialog Styling

**Files:**
- Modify: `components/dashboard/project/asset-dialog.tsx`

- [ ] **Step 1: Add Framer Motion imports and update Dialog headers**
  Import `motion` and `AnimatePresence` and style the main dialog title details.
  ```tsx
  import { motion, AnimatePresence } from "framer-motion";
  ```

- [ ] **Step 2: Add Category detail card grid layout**
  Update the main category selection trigger to use a 3-column layout where the right column displays an interactive glassmorphism card with the count of active attributes.
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
    <div className="md:col-span-2 space-y-2">
      <Label className="text-[11px] font-bold tracking-wider text-muted-foreground ml-1">Asset Classification</Label>
      {/* ... Select Classification dropdown ... */}
    </div>

    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-between h-full min-h-[72px] relative overflow-hidden backdrop-blur-xs shadow-inner">
      <div className="absolute right-2 -bottom-2 opacity-5">
        <Layers className="h-16 w-16 text-primary" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-primary/80">Active Attributes</span>
      <span className="text-2xl font-black text-primary mt-1">{selectedCategory.attributes.length} fields</span>
    </div>
  </div>
  ```

- [ ] **Step 3: Wrap specifications panel with slide/height motion container**
  Wrap the `selectedCategory.attributes` spec grid in a spring-animated `motion.div` transition container.
  ```tsx
  <AnimatePresence mode="wait">
    {selectedCategory && (
      <motion.div
        key={selectedCategory.id}
        initial={{ opacity: 0, height: 0, y: 10 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-6 pt-2 pb-6 overflow-hidden"
      >
        {/* Dynamic Specifications grid */}
      </motion.div>
    )}
  </AnimatePresence>
  ```

- [ ] **Step 4: Update custom switch and input indicators**
  Enhance standard input triggers with glowing focus states, and update switches to render bold status texts ("Enabled" / "Disabled") and responsive color indicators.

---

### Task 2: Refactor BulkUploadDialog Styling

**Files:**
- Modify: `components/dashboard/project/bulk-upload-dialog.tsx`

- [ ] **Step 1: Add stepper bar indicator**
  Insert a visual progress stepper panel at the top of the dialog content, dynamically rendering current step states.

- [ ] **Step 2: Add interactive uploader drag variables**
  Add state hook `const [isDragOver, setIsDragOver] = React.useState(false);` and wire up drag enter, drag leave, and drop handlers.

- [ ] **Step 3: Style template uploader drop zone and tables**
  - Revamp the drag-and-drop file uploader area. Apply scale transform and glowing borders on drag-over.
  - Style preview tables with sticky headers, zebra rows, and custom verification alert widgets.
