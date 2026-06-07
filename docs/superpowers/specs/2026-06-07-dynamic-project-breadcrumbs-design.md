# Dynamic Project Breadcrumbs Design

This specification details the design and implementation to resolve project names in the breadcrumb component. Instead of displaying raw numerical/UUID IDs (such as "1") in the breadcrumb navigation, the component will load and show the project's actual name.

## Proposed Changes

### Components

#### [MODIFY] [dynamic-breadcrumbs.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/dynamic-breadcrumbs.tsx)

1. **Configurable Home Link**:
   - Update `Props` to include `showHome?: boolean` (defaults to `true`) and `homeHref?: string` (defaults to `"/"`).
   - In the component JSX, conditionally render the root/home breadcrumb item only if `showHome` is `true`.

2. **Regex Path Formatting**:
   - Update the path string replacement from `.replace("-", " ")` to `.replace(/-/g, " ")` to ensure that all hyphens in a path segment are correctly replaced with spaces.

---

#### [MODIFY] [app-header.tsx](file:///Users/mbp/Desktop/Code/tracerpro-new/components/sidebar/app-header.tsx)

1. **Reuse DynamicBreadcrumbs**:
   - Import `DynamicBreadcrumbs` from `@/components/dynamic-breadcrumbs`.
   - Remove the local custom path segment mapper and inline `<Breadcrumb>` element.
   - Insert `<DynamicBreadcrumbs>` with properties:
     - `className="hidden md:flex"`
     - `showHome={false}`
     - `labelMap={{ dashboard: "Dashboard", users: "Users", settings: "Settings" }}`

## Verification Plan

### Manual Verification
1. Navigate to `/dashboard/projects`. Ensure the breadcrumb reads `Dashboard / Projects`.
2. Open a project detail page (e.g. `/dashboard/projects/1`).
3. Verify that the breadcrumb initially shows `Dashboard / Projects / 1` and then updates to `Dashboard / Projects / [Project Name]` once resolved.
4. Verify that multi-word segment formatting works correctly (e.g., if a segment has multiple hyphens, they are all replaced by spaces and capitalized).
