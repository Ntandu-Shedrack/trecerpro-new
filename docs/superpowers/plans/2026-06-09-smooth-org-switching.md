# Smooth Organization Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix organization routing security and improve switching UX by activating Next.js middleware, implementing dashboard-level redirection, and adding loading indicators during transitions.

**Architecture:** 
- Root `middleware.ts` created to act as the Next.js entrypoint, proxying requests to the already implemented routing proxy `proxy.ts`.
- Context `switchOrganization` action updated to push route to `/dashboard/overview` and trigger a `router.refresh()`.
- Dropdown component `CustomOrgSwitcher` updated with switching states, Sonner `toast.promise` visual feedback, and disabled click states.

**Tech Stack:** Next.js 16 (App Router), React 19, Lucide React (Loader2), Sonner Toast

---

### Task 1: Create Next.js Middleware File

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts` in the root directory**

Write the following content to `middleware.ts`:
```typescript
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

export async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    // Match all request paths except Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

- [ ] **Step 2: Verify middleware compilation**
Run command: `pnpm tsc --noEmit`
Expected: Passes with no typescript compilation errors.

- [ ] **Step 3: Commit Task 1**
```bash
git add middleware.ts
git commit -m "feat: add root middleware.ts delegating to proxy.ts"
```

---

### Task 2: Implement Client-Side Redirection in Auth Context

**Files:**
- Modify: `context/auth-context.tsx`

- [ ] **Step 1: Modify `switchOrganization` to push route to overview**

Locate lines 159-172 of `context/auth-context.tsx` and change `switchOrganization` implementation:
```typescript
  const switchOrganization = async (orgId: string | number) => {
    const res = await fetch(`/api/organizations/${orgId}/switch`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to switch organization");
    }

    setUser(data.user);
    router.push("/dashboard/overview");
    router.refresh();
  };
```

- [ ] **Step 2: Verify types and imports**
Run command: `pnpm tsc --noEmit`
Expected: Passes with no typescript compilation errors.

- [ ] **Step 3: Commit Task 2**
```bash
git add context/auth-context.tsx
git commit -m "feat: redirect user to dashboard overview when switching organizations"
```

---

### Task 3: Add Loading State and User Feedback to Switcher UI

**Files:**
- Modify: `components/dashboard/settings/organization/custom-org-switcher.tsx`

- [ ] **Step 1: Import Loader2 and update state**

Add `Loader2` to the `lucide-react` imports:
```typescript
import { ChevronsUpDown, Plus, Check, Building2, Loader2 } from "lucide-react";
```
Add `isSwitching` state to `CustomOrgSwitcher`:
```typescript
  const [isSwitching, setIsSwitching] = React.useState(false);
```

- [ ] **Step 2: Update handleSwitch to use toast.promise and loading state**

Update `handleSwitch` in `custom-org-switcher.tsx`:
```typescript
  const handleSwitch = async (orgId: string) => {
    if (isSwitching) return;
    try {
      setIsSwitching(true);
      const promise = setActive({ organization: orgId });
      toast.promise(promise, {
        loading: "Switching organization...",
        success: "Switched organization successfully!",
        error: "Failed to switch organization",
      });
      await promise;
    } catch (e: any) {
      console.error("Failed to switch organization:", e);
    } finally {
      setIsSwitching(false);
    }
  };
```

- [ ] **Step 3: Disable and update the trigger button with loading spinner**

Modify the `DropdownMenuTrigger` and its button:
```typescript
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isSwitching}>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 py-2 h-auto hover:bg-sidebar-accent"
            disabled={isSwitching}
          >
            <div className="flex items-center gap-2">
              {isSwitching ? (
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : organization?.imageUrl ? (
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  width={28}
                  height={28}
                  className="rounded-md"
                />
              ) : (
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              )}

              <div className="flex flex-col text-left">
                <span className="text-sm font-medium leading-none">
                  {isSwitching ? "Switching..." : (organization?.name || "Select organization")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {organization ? "Active organization" : "No organization"}
                </span>
              </div>
            </div>

            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
```

- [ ] **Step 4: Prevent clicks on dropdown menu items during switching**

In the dropdown items mapping, verify click handlers are guarded by `isSwitching`:
```typescript
              <DropdownMenuItem
                key={org.id}
                onClick={() => !isSwitching && handleSwitch(org.id)}
                className="flex items-center justify-between gap-2"
                disabled={isSwitching}
              >
```

- [ ] **Step 5: Verify building and linting**
Run command: `pnpm tsc --noEmit && pnpm lint`
Expected: PASS

- [ ] **Step 6: Commit Task 3**
```bash
git add components/dashboard/settings/organization/custom-org-switcher.tsx
git commit -m "feat: show loading toast and disabled states in organization switcher UI"
```
