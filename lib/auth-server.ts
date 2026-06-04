/**
 * Server-side auth utilities.
 *
 * Import these in Server Components, Server Actions, and Route Handlers.
 * For client components, use hooks from `@/context/auth-context`.
 */
export { getSession, getCurrentUserProfile, fetchCurrentUser } from "@/lib/auth/session";
