# Sidebar and Navigation Components Improvement Spec

This document details the enhancements to be made to the sidebar and its associated navigation components (projects list and organization switcher) to elevate them to production-level quality.

## Objective
Replace basic browser-native dialogs (`prompt`, `confirm`) with custom, styled React components (shadcn `Dialog` and `AlertDialog`) and improve the user interface with loading skeletons, standard components, and clean styling.

## Target Components

### 1. `components/dashboard/settings/organization/custom-org-switcher.tsx`
*   **Problem**: Currently uses browser `prompt()` to create a new organization.
*   **Improvement**: 
    *   Integrate the Shadcn UI `Dialog` component.
    *   Implement state-driven controlled input for the new organization name.
    *   Add loading states during organization creation.

### 2. `components/nav-projects.tsx`
*   **Problem**: Uses browser `confirm()` to delete a project, renders a custom inline `Button` helper, and has a plain text `Loading projects...` loading state.
*   **Improvement**:
    *   Integrate Shadcn UI `AlertDialog` component for project deletion confirmations.
    *   Import and use the official `@/components/ui/button` component.
    *   Implement polished skeleton loading placeholders matching the project rows utilizing the `@/components/ui/skeleton` component.

## Verification Plan

### Automated/Compiler Checks
*   Verify that TypeScript builds successfully (`pnpm run build` or Next.js type check).

### Manual Verification
*   Open the organization switcher and click "Create organization". Check that a modal opens and successfully creates the organization.
*   Hover over a project, click the options menu (`...`), and select "Delete Project". Confirm that the Shadcn alert dialog is shown.
*   Simulate loading states to verify that the project lists render skeletons instead of text.
