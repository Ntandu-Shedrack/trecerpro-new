# TracerPro architecture

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Auth | Laravel Sanctum via HttpOnly `auth_token` cookie |
| API | Laravel REST (`API_URL` / `NEXT_PUBLIC_API_URL`) |
| Route protection | `proxy.ts` (cookie presence check, Next.js 16 convention) |
| Data mutations/queries | Server Actions in `actions/` |
| UI | React 19, shadcn/ui, Tailwind |

## Layer rules

- **`app/`** — Routes, layouts, server data composition. No direct `api` imports.
- **`app/api/auth/`** — Next.js Route Handlers for auth operations (login, register, logout, me, forgot-password). Set/clear HttpOnly cookies.
- **`app/api/organizations/`** — Next.js Route Handlers for client-initiated org operations.
- **`actions/`** — Server-only domain operations; return `{ data, error }` or `{ success, error }`.
- **`lib/api/client.ts`** — Axios instance + server-side bearer token injection + 401 interceptor.
- **`lib/auth/session.ts`** — Server session helpers (`getSession`, `getCurrentUserProfile`). Wrapped with `cache()`.
- **`lib/auth/api-proxy.ts`** — Server-side helper to call Laravel with the HttpOnly cookie token.
- **`context/auth-context.tsx`** — Client session state, org switching, `useSession` / `useCurrentOrganization`.
- **`components/`** — Presentation; call actions from event handlers. No `import api from "@/lib/api"`.

## Auth flow

1. User submits login form → `POST /api/auth/login` (Next.js Route Handler).
2. Route Handler calls Laravel `/api/login`, receives token, sets it as **HttpOnly** `auth_token` cookie.
3. `proxy.ts` checks for the cookie and redirects unauthenticated users away from `/dashboard/*`.
4. Server Components / Actions call `getSession()` from `lib/auth/session.ts` (reads HttpOnly cookie via `next/headers`).
5. Client components call `GET /api/auth/session` (Next.js Route Handler proxies to Laravel) to hydrate user state.
6. On 401, the Axios interceptor in `lib/api/client.ts` calls `POST /api/auth/logout` and redirects to `/sign-in`.

## Cookie security

| Property | Value | Reason |
|----------|-------|--------|
| `httpOnly` | `true` | Not accessible to JS — XSS protection |
| `secure` | `true` in production | HTTPS only |
| `sameSite` | `lax` | Allows redirect-based flows |
| `path` | `/` | Available to all routes |
| `maxAge` | 7 days | Session lifetime |

## Deferred (not wired)

- **`supabase/migrations/`** — Target Postgres schema; not used at runtime.
- **`lib/_deferred/supabase/`** — Clerk/Supabase sync utilities kept for a future migration.

## Billing

`actions/billing.actions.ts` uses in-memory mocks until Laravel exposes billing endpoints.
