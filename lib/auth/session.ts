import { cache } from "react";
import { cookies } from "next/headers";
import api from "@/lib/api";
import type { User } from "@/types";

/**
 * Fetches the current user from Laravel using the HttpOnly auth_token cookie.
 *
 * Wrapped with React's `cache()` so that multiple Server Components calling
 * this within the same render cycle share a single network request to Laravel.
 */
export const fetchCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const response = await api.get<User>("/api/user");
    return response.data;
  } catch {
    return null;
  }
});

export function getOrgIdFromUser(user: User | null): string | null {
  if (!user) return null;
  const orgId =
    user.current_organization?.id ??
    user.currentOrganization?.id ??
    (user.organizations && user.organizations.length > 0 ? user.organizations[0].id : null);
  return orgId != null ? String(orgId) : null;
}

export async function getSession() {
  const user = await fetchCurrentUser();
  return {
    userId: user?.id != null ? String(user.id) : null,
    orgId: getOrgIdFromUser(user),
    user,
  };
}

export async function getCurrentUserProfile() {
  const user = await fetchCurrentUser();
  if (!user) return null;
  return {
    id: String(user.id),
    firstName: user.name?.split(" ")[0] || "User",
    lastName: user.name?.split(" ").slice(1).join(" ") || "",
    emailAddress: user.email,
  };
}
