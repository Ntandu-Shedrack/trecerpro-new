# Dynamic Project Breadcrumbs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve raw project IDs in the breadcrumbs navigation of the main sidebar header into their human-readable project names.

**Architecture:** Refactor `DynamicBreadcrumbs` to support flexible configuration (conditionally hiding the root home link) and then use it inside the dashboard's `AppHeader` to replace the existing basic title-casing mapping.

**Tech Stack:** React, Next.js, Tailwind CSS

---

### Task 1: Refactor `DynamicBreadcrumbs` Component

**Files:**
- Modify: `components/dynamic-breadcrumbs.tsx`

- [ ] **Step 1: Modify `Props` interface and destructured parameters**
  Add `homeHref` and `showHome` optional properties.
  
  ```tsx
  type Props = {
    homeLabel?: string;
    homeHref?: string;
    showHome?: boolean;
    labelMap?: Record<string, string>;
    configMap?: Record<string, BreadcrumbConfig>;
    className?: string;
  };

  export function DynamicBreadcrumbs({
    homeLabel = "TracerPro",
    homeHref = "/",
    showHome = true,
    labelMap = {},
    configMap = {},
    className,
  }: Props) {
  ```

- [ ] **Step 2: Update rendering JSX to support conditional home link and correct separators**
  Conditionally render the home link and render separators between subsequent items.

  ```tsx
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {showHome && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={homeHref}>{homeLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {(showHome || index > 0) && <BreadcrumbSeparator />}

            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
  ```

---

### Task 2: Update `AppHeader` to use `DynamicBreadcrumbs`

**Files:**
- Modify: `components/sidebar/app-header.tsx`

- [ ] **Step 1: Replace custom breadcrumb mapping and JSX rendering**
  Import `DynamicBreadcrumbs` and remove unused local breadcrumb variables and UI imports.

  ```tsx
  import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";
  ```

  Replace the `<Breadcrumb>` container in JSX (lines 44-72) with:

  ```tsx
  <DynamicBreadcrumbs
    className="hidden md:flex"
    showHome={false}
    labelMap={{
      dashboard: "Dashboard",
      users: "Users",
      settings: "Settings",
    }}
  />
  ```

- [ ] **Step 2: Clean up unused imports**
  Remove unused imports in `components/sidebar/app-header.tsx` (such as `Breadcrumb`, `BreadcrumbList`, etc.).
