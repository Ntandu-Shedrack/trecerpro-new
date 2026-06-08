# Invite Button on Organization Members Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Invite Member button to the Invitations sub-tab search header and to its empty state when there are no invitations.

**Architecture:** We will modify `members-tab.tsx` and `invitations-list.tsx` to reuse the existing `InviteMemberDialog` component under the `canManage` permission check.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, Lucide Icons.

---

### Task 1: Add Invite Button to Empty State in `members-tab.tsx`

**Files:**
- Modify: `components/dashboard/settings/organization/members-tab.tsx:148-161`

- [ ] **Step 1: Modify the Invitations tab content empty state**
  Replace the existing empty state block with one that displays the `InviteMemberDialog` wrapping a secondary outline button when `canManage` is true.

  **Target Code in `components/dashboard/settings/organization/members-tab.tsx`:**
  ```tsx
        <TabsContent value="invitations" className="mt-6">
          {invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </div>
          ) : (
            <InvitationsList
              organizationId={organization.id}
              invitations={invitations}
              canManage={canManage}
              onChanged={loadData}
            />
          )}
        </TabsContent>
  ```

  **Replacement Code:**
  ```tsx
        <TabsContent value="invitations" className="mt-6">
          {invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">No pending invitations</p>
              {canManage && (
                <InviteMemberDialog
                  organizationId={organization.id}
                  onInvited={loadData}
                >
                  <Button variant="outline" className="mt-4">
                    Invite a member
                  </Button>
                </InviteMemberDialog>
              )}
            </div>
          ) : (
            <InvitationsList
              organizationId={organization.id}
              invitations={invitations}
              canManage={canManage}
              onChanged={loadData}
            />
          )}
        </TabsContent>
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add components/dashboard/settings/organization/members-tab.tsx
  git commit -m "feat: add invite button to invitations tab empty state"
  ```

---

### Task 2: Add Invite Button to Search Header in `invitations-list.tsx`

**Files:**
- Modify: `components/dashboard/settings/organization/invitations-list.tsx:1-31` (for imports)
- Modify: `components/dashboard/settings/organization/invitations-list.tsx:65-76` (for layout)

- [ ] **Step 1: Add imports to `invitations-list.tsx`**
  Add `InviteMemberDialog` and `UserPlus` to the imports list.

  **Target Code (lines 16-20 in `components/dashboard/settings/organization/invitations-list.tsx`):**
  ```tsx
  import { Input } from "@/components/ui/input";
  import { Loader2, Mail, Trash2, Search } from "lucide-react";
  ```

  **Replacement Code:**
  ```tsx
  import { Input } from "@/components/ui/input";
  import { Loader2, Mail, Trash2, Search, UserPlus } from "lucide-react";
  import { InviteMemberDialog } from "./invite-member-dialog";
  ```

- [ ] **Step 2: Update Layout in `invitations-list.tsx` to include Invite button**
  Change the search header wrapper block to be a flex container that accommodates the "Invite Member" button aligned to the right when `canManage` is true.

  **Target Code (lines 65-76 in `components/dashboard/settings/organization/invitations-list.tsx`):**
  ```tsx
    return (
      <div className="space-y-4">
        {/* Search Header */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invitations by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
  ```

  **Replacement Code:**
  ```tsx
    return (
      <div className="space-y-4">
        {/* Search Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invitations by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {canManage && (
            <InviteMemberDialog
              organizationId={organizationId}
              onInvited={onChanged}
            >
              <Button className="gap-2 shadow-sm w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </InviteMemberDialog>
          )}
        </div>
  ```

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add components/dashboard/settings/organization/invitations-list.tsx
  git commit -m "feat: add invite button to invitations list search header"
  ```

---

### Task 3: Run Validation

- [ ] **Step 1: Check Typescript compiling**
  Run: `npx tsc --noEmit`
  Expected: No compilation/type errors.

- [ ] **Step 2: Run linter**
  Run: `pnpm lint` or `npx eslint .`
  Expected: No linting errors.
