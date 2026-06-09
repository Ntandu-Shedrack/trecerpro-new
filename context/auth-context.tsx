"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { Organization, User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchOrganization: (orgId: string | number) => Promise<void>;
  createOrganization: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCurrentOrg(user: User | null): Organization | null {
  return (
    user?.current_organization ??
    user?.currentOrganization ??
    (user?.organizations && user.organizations.length > 0 ? user.organizations[0] : null)
  );
}

function mapOrgRole(role?: string): "org:admin" | "org:member" {
  if (role === "owner" || role === "admin") return "org:admin";
  return "org:member";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetches the current user from GET /api/auth/session (HttpOnly cookie → Laravel).
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.status === 401 || res.status === 503) {
        setUser(null);
        return;
      }
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  /**
   * Authenticates the user via POST /api/auth/login.
   * The route handler sets the HttpOnly auth_token cookie on success.
   * Throws on failure so the calling UI can display the error.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const messages = Object.values(data.errors).flat().filter(Boolean);
          if (messages.length > 0) {
            throw new Error(messages.join(" "));
          }
        }
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);

      console.log("user", data.user)
    } finally {
      setLoading(false);
    }
    // Navigate after loading is cleared to avoid a loading flash
    router.push("/dashboard/overview");
  };

  /**
   * Registers a new user via POST /api/auth/register.
   * The route handler sets the HttpOnly auth_token cookie on success.
   * Throws on failure so the calling UI can display the error.
   */
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const messages = Object.values(data.errors).flat().filter(Boolean);
          if (messages.length > 0) {
            throw new Error(messages.join(" "));
          }
        }
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user);
    } finally {
      setLoading(false);
    }
    router.push("/dashboard/overview");
  };

  /**
   * Logs out the user by calling POST /api/auth/logout, which revokes the
   * Sanctum token on Laravel and clears the HttpOnly cookie.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Proceed with local logout even if the server call fails
    } finally {
      setUser(null);
      setLoading(false);
    }
    router.push("/sign-in");
  };

  /**
   * Switches the active organization.
   * Throws on failure so the calling UI can display the error.
   */
  const switchOrganization = async (orgId: string | number) => {
    const res = await fetch(`/api/organizations/${orgId}/switch`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to switch organization");
    }

    setUser(data.user);
    router.refresh();
  };

  /**
   * Creates a new organization.
   * Throws on failure so the calling UI can display the error.
   */
  const createOrganization = async (name: string) => {
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create organization");
    }

    await refreshUser();
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        login,
        register,
        logout,
        switchOrganization,
        createOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Public hooks ────────────────────────────────────────────────────────────

export function useSession() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useSession must be used within an AuthProvider");

  const currentOrg = getCurrentOrg(context.user);
  const matchedOrg = context.user?.organizations?.find(
    (org) => String(org.id) === String(currentOrg?.id)
  );
  const membershipRole = mapOrgRole(matchedOrg?.pivot?.role ?? currentOrg?.pivot?.role);

  const hasPermission = (permission: string) => {
    if (permission === "org:sys_memberships:manage") {
      return membershipRole === "org:admin";
    }
    return false;
  };

  return {
    isLoaded: !context.loading,
    isSignedIn: !!context.user,
    userId: context.user?.id != null ? String(context.user.id) : null,
    orgId: currentOrg?.id != null ? String(currentOrg.id) : null,
    membershipRole,
    hasPermission,
    /** Returns null — token is HttpOnly and not accessible client-side. */
    getToken: async () => null,
    signOut: context.logout,
    /** @deprecated Use hasPermission() directly */
    has: ({ permission }: { permission: string }) => ({
      permission,
      has: hasPermission(permission),
    }),
  };
}

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useUser must be used within an AuthProvider");
  return {
    isLoaded: !context.loading,
    isSignedIn: !!context.user,
    user: context.user
      ? {
        id: String(context.user.id),
        fullName: context.user.name,
        primaryEmailAddress: { emailAddress: context.user.email },
      }
      : null,
  };
}

/** @deprecated Use useSession */
export const useAuth = useSession;

export function useCurrentOrganization() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useCurrentOrganization must be used within an AuthProvider"
    );

  const currentOrg = getCurrentOrg(context.user);
  const matchedOrg = context.user?.organizations?.find(
    (org) => String(org.id) === String(currentOrg?.id)
  );
  const orgRole = matchedOrg?.pivot?.role ?? currentOrg?.pivot?.role;

  return {
    isLoaded: !context.loading,
    organization: currentOrg
      ? {
        id: String(currentOrg.id),
        name: currentOrg.name,
        slug: currentOrg.slug,
        imageUrl: currentOrg.image_url,
      }
      : null,
    membership: orgRole
      ? { role: mapOrgRole(orgRole) }
      : null,
  };
}

/** @deprecated Use useCurrentOrganization */
export const useOrganization = useCurrentOrganization;

export function useOrganizationList() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useOrganizationList must be used within an AuthProvider");

  return {
    isLoaded: !context.loading,
    setActive: async ({ organization }: { organization: string }) => {
      await context.switchOrganization(organization);
    },
    userMemberships: {
      data:
        context.user?.organizations?.map((org) => ({
          organization: {
            id: String(org.id),
            name: org.name,
            slug: org.slug,
            imageUrl: org.image_url,
          },
          role: mapOrgRole(org.pivot?.role),
        })) ?? [],
    },
  };
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
