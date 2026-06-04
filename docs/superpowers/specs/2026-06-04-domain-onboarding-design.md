# Design Spec: Domain-Based Organization Onboarding & Join Requests

We are improving the onboarding flow to let users select organizations matching their email domain. Organizations can optionally require admin approval before a user is allowed to join.

## Proposed Changes

### Database schema and migrations (Laravel Backend)

We will create a migration in the Laravel project to add join approval settings and request storage:

1. **`organizations` table update:**
   * Add `require_join_approval` boolean column (default `false`).

2. **`join_requests` table creation:**
   * Create `join_requests` table:
     * `id`
     * `user_id` (foreign key to `users`, constrained, cascade on delete)
     * `organization_id` (foreign key to `organizations`, constrained, cascade on delete)
     * `status` (string, default `'pending'`) - states: `pending`, `approved`, `rejected`
     * `timestamps`
     * Unique index on `['user_id', 'organization_id']`

### Backend Models & Eloquent Relationships

1. **`App\Models\JoinRequest`** [NEW]:
   * Belongs to `User`
   * Belongs to `Organization`

2. **`App\Models\Organization`** [MODIFY]:
   * Add `joinRequests()` HasMany relationship.
   * Add `require_join_approval` to fillable attributes and cast to boolean.

3. **`App\Models\User`** [MODIFY]:
   * Add `joinRequests()` HasMany relationship.

### Backend Routing and Controller Logic

1. **`routes/api.php`** [MODIFY]:
   * Add routes under `auth:sanctum`:
     * `GET /organizations/{organization}/join-requests` -> `OrganizationController@joinRequests`
     * `POST /join-requests/{join_request}/approve` -> `OrganizationController@approveJoinRequest`
     * `POST /join-requests/{join_request}/reject` -> `OrganizationController@rejectJoinRequest`

2. **`App\Http\Controllers\OrganizationController`** [MODIFY]:
   * Update `suggested`:
     * Returns suggested organizations matching user email domain.
     * Include `require_join_approval` attribute on each organization.
     * Check if current user has a record in `join_requests` for this organization, returning `join_request_status` (`pending`, `approved`, `rejected` or `null`).
   * Update `join`:
     * If user is already a member, return 422.
     * Check domain match.
     * If `require_join_approval` is `true`:
       * Create or return existing `JoinRequest` for `user_id` and `organization_id` with status `pending`.
       * Return response with status indicating approval is required and request is pending.
     * If `require_join_approval` is `false`:
       * Attach user to organization memberships with role `'member'`.
       * Auto-switch user's current organization.
       * Return success.
   * Add `joinRequests(Organization $organization)` [NEW]:
     * Check user is owner/admin of the organization.
     * Return list of pending join requests with user details.
   * Add `approveJoinRequest(JoinRequest $joinRequest)` [NEW]:
     * Check user is owner/admin of the organization.
     * Attach the requesting user to the organization.
     * Update request status to `approved`.
     * Switch user to the organization (optional).
   * Add `rejectJoinRequest(JoinRequest $joinRequest)` [NEW]:
     * Check user is owner/admin of the organization.
     * Update request status to `rejected`.

### Frontend API Client & Component Logic (Next.js)

1. **`types/domain.ts`** [MODIFY]:
   * Update `Organization` interface:
     * `require_join_approval?: boolean;`
     * `join_request_status?: 'pending' | 'approved' | 'rejected' | null;`

2. **`actions/organization.actions.ts`** [MODIFY]:
   * Update `joinOrganization` to handle both immediate successes and pending approvals.
   * Add server action `getJoinRequests(orgId: string)`
   * Add server action `resolveJoinRequest(requestId: number, action: 'approve' | 'reject')`

3. **`components/forms/OnBoardingForm.tsx`** [MODIFY]:
   * Enhance Suggested Organizations list:
     * Loop through suggested organizations.
     * Display a badge:
       * If `join_request_status === 'pending'`: "Pending Approval" (amber, disabled button).
       * Else if `require_join_approval === true`: "Requires Approval" (amber badge) with button text "Request to Join".
       * Else: "Auto-Join" (green badge) with button text "Join".
     * Handle the click event for "Request to Join":
       * Triggers join request API call, shows a pending spinner, and updates local list state setting `join_request_status = 'pending'` on success. Shows toast message.

## Verification Plan

### Automated/Manual Testing
* Run migration.
* Seed some organizations:
  * Organization A: `require_join_approval = false`
  * Organization B: `require_join_approval = true`
* Create a user with domain matching seed users (e.g. `user@testcompany.com`).
* Log in, go to onboarding.
* Verify suggested organizations load A and B.
* Join Organization A: Verify instant login and redirection to dashboard.
* Request to join Organization B: Verify UI updates to "Pending Approval" and button gets disabled. Verify DB has `join_requests` entry.
