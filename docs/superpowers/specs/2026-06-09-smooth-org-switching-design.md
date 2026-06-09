# Design Spec: Smooth Organization Switching and Middleware Activation

This spec outlines the design for fixing and enhancing organization switching in the Next.js application, including routing protection via Next.js middleware and UX updates for state transitions.

## Goals

1. **Activate Middleware Route Protection**: Activate route guarding and automatic onboarding redirects by wiring up the existing `proxy.ts` routing logic to a standard Next.js `middleware.ts` entrypoint.
2. **Clean Switch State Transitions**: Ensure that switching organizations always redirects the user to `/dashboard/overview`, resolving data mismatches when switching organizations from project-specific routes.
3. **Switching Feedback**: Enhance the UI switcher component to show loading indicators and prevent multiple trigger requests.

---

## 1. Middleware Integration

Next.js only executes middleware defined in a root-level `middleware.ts` or `middleware.js` file. We will create a `middleware.ts` file at the project root:

- **Target**: `middleware.ts` (new file at root)
- **Role**: Import `proxy` from `./proxy` and default-export it as the `middleware` function. Include the corresponding route matcher config from `proxy.ts`.

---

## 2. Redirection and Session Context Update

- **Target**: `context/auth-context.tsx`
- **Method**: `switchOrganization`
- **Behavior**:
  - Request the backend to switch active organization context.
  - Set the state on the client-side (`setUser`).
  - Redirect the user to `/dashboard/overview` using `router.push()`.
  - Force Next.js cache revalidation using `router.refresh()`.

---

## 3. UI and UX Upgrades

- **Target**: `components/dashboard/settings/organization/custom-org-switcher.tsx`
- **Changes**:
  - Add `isSwitching` React state to track ongoing organization switches.
  - Add a visual spinner (`Loader2` from `lucide-react`) to the trigger button when `isSwitching` is true.
  - Wrap the `setActive` call inside `handleSwitch` with a `toast.promise` from `sonner` to display clear feedback ("Switching organization...", "Switched organization successfully!").
  - Disable trigger clicks and dropdown interactions during switching to avoid double-triggers.
