import axios from "axios";
import { getApiBaseUrl } from "@/lib/config/env";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Required to bypass the ngrok browser warning interstitial page
    "ngrok-skip-browser-warning": "true",
  },
});

function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;
    let activeOrgId: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: read cookies via next/headers
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("auth_token")?.value;
        activeOrgId = cookieStore.get("active_organization_id")?.value;
      } catch {
        // cookies() throws outside a request context (e.g. static generation)
      }
    } else {
      // Client-side: read cookies from document.cookie
      activeOrgId = getClientCookie("active_organization_id") || undefined;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeOrgId) {
      config.headers["X-Active-Organization"] = activeOrgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — handles 401 Unauthorized globally.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear any stale client-side state and redirect to login
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Ignore — we still want to redirect
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Maps Laravel 422 validation errors back to react-hook-form fields.
 */
export function mapLaravelValidationErrors(
  errors: Record<string, string[]>,
  setError: (field: any, error: { message: string }) => void
) {
  Object.entries(errors).forEach(([field, messages]) => {
    if (messages && messages.length > 0) {
      setError(field, { message: messages[0] });
    }
  });
}

export default api;

