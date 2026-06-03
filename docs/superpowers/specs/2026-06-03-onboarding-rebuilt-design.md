# Design Spec: Domain-Based Organization Onboarding Flow

We are removing the original multi-step onboarding flow (General -> Categories -> Attributes) and replacing it with a simplified flow where users who are not linked to any organization are directed to either create a new organization or join an existing one matching their email domain.

## Goals
* **Simplify onboarding**: Remove the original three-step configuration wizard.
* **Domain-based matching**: Allow users to auto-discover and join organizations sharing their company email domain (excluding public email providers like Gmail).
* **Direct workspace transition**: Auto-activate and switch to any newly created or joined organization.

---

## 1. Backend Changes (Laravel)

### 1.1 Routes (`routes/api.php`)
Register two new API endpoints under the `auth:sanctum` middleware group:
* `GET /api/organizations/suggested`: List organizations matching the user's email domain.
* `POST /api/organizations/{organization}/join`: Join an organization directly.

### 1.2 Controller Implementation (`OrganizationController.php`)
* **`suggested`**:
  * Extract domain: `$domain = substr(strrchr($user->email, "@"), 1)`.
  * Return empty list if domain is in `$ignoredDomains` (e.g. `gmail.com`, `yahoo.com`, etc.).
  * Query organizations having at least one user with email ending in `@$domain`, excluding organizations where the user is already a member.
* **`join`**:
  * Verify user is not already a member.
  * Verify user's email domain matches the organization's existing domain.
  * Attach user as a `member` role in the `memberships` pivot table.
  * Call `$user->switchOrganization($organization->id)` to auto-activate the organization context.

---

## 2. Frontend Changes (Next.js)

### 2.1 Server Actions (`actions/organization.actions.ts`)
* `getSuggestedOrganizations()`: Calls backend `GET /api/organizations/suggested`.
* `joinOrganization(organizationId)`: Calls backend `POST /api/organizations/{organizationId}/join` and updates local `active_organization_id` cookie.

### 2.2 Route Handlers (`app/api/organizations/route.ts`)
* Intercept `POST` (create organization) success responses to write the `active_organization_id` cookie immediately.

### 2.3 Navigation Middleware (`proxy.ts`)
* Redirect logged-in users *without* an active organization to `/onboarding` if they try to access `/dashboard/*`.
* Redirect logged-in users *with* an active organization to `/dashboard/overview` if they try to access `/onboarding`.

### 2.4 Cleanup
* Delete obsolete step components in `components/sections/onboarding/steps/` and `onboarding-progress.tsx`.

### 2.5 UI / UX Design (`components/forms/OnBoardingForm.tsx`)
* Replace wizard flow with a side-by-side split container.
* Left side: **Create Organization Form** (Input name, loader, success redirect).
* Right side: **Join Workspace List**
  * Auto-loads workspaces matching user's email domain.
  * Hover states and micro-animations for interactive cards.
  * Informative state banners for public email domains (gmail, yahoo, etc.) or when no matching organizations are found.
