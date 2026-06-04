import { cookies } from "next/headers";

/**
 * Reads the HttpOnly auth_token cookie from the incoming request context.
 * Only callable in Server Components, Route Handlers, and Server Actions.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value ?? null;
  } catch {
    // cookies() throws outside a request context (e.g. during static generation)
    return null;
  }
}

/**
 * Returns the configured Laravel API base URL.
 */
export function getLaravelBaseUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ungangrenous-endosporous-zainab.ngrok-free.dev"
  );
}

type LaravelFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  /** If true, the Authorization header is NOT added (for public endpoints like login). */
  skipAuth?: boolean;
};

/**
 * Makes an authenticated fetch to the Laravel API.
 * Automatically attaches the Bearer token from the HttpOnly cookie.
 */
export async function laravelFetch(
  path: string,
  options: LaravelFetchOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers: extraHeaders = {}, ...rest } = options;

  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Bypasses the ngrok browser warning interstitial
    "ngrok-skip-browser-warning": "true",
    ...extraHeaders,
  };

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      baseHeaders["Authorization"] = `Bearer ${token}`;
    }
    try {
      const cookieStore = await cookies();
      const activeOrgId = cookieStore.get("active_organization_id")?.value;
      if (activeOrgId) {
        baseHeaders["X-Active-Organization"] = activeOrgId;
      }
    } catch {
      // cookies() throws outside a request context
    }
  }

  return fetch(`${getLaravelBaseUrl()}${path}`, {
    ...rest,
    headers: baseHeaders,
  });
}

export type LaravelJsonResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; data: Record<string, unknown>; status: number; message: string };

/** Status code to return to the browser when Laravel/ngrok is unreachable. */
export function clientStatusForLaravelError(
  parsed: Extract<LaravelJsonResult<unknown>, { ok: false }>
): number {
  if (
    parsed.message.includes("unreachable") ||
    parsed.message.includes("Invalid API response")
  ) {
    return 503;
  }
  if (parsed.status === 401 || parsed.status === 403) return parsed.status;
  if (parsed.status === 422) return 422;
  if (parsed.status >= 400 && parsed.status < 500) return parsed.status;
  return 502;
}

/** Reads token from common Laravel / Sanctum login response shapes. */
export function extractAuthToken(
  data: Record<string, unknown>
): string | null {
  const keys = ["token", "access_token", "accessToken", "plainTextToken"];
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  const nested = data.data;
  if (nested && typeof nested === "object") {
    return extractAuthToken(nested as Record<string, unknown>);
  }
  return null;
}

/**
 * Safely parses a Laravel response body. Handles HTML/plain-text errors
 * (e.g. ngrok offline, 404 HTML pages) without throwing SyntaxError.
 */
export async function parseLaravelJson<T = Record<string, unknown>>(
  response: Response
): Promise<LaravelJsonResult<T>> {
  const text = await response.text();
  const status = response.status;

  if (!text.trim()) {
    return {
      ok: false,
      data: {},
      status,
      message:
        status >= 500
          ? "API server error"
          : "Empty response from API — is Laravel running?",
    };
  }

  try {
    const data = JSON.parse(text) as T;
    if (!response.ok) {
      const record = data as Record<string, unknown>;
      const message =
        (typeof record.message === "string" && record.message) ||
        (typeof record.error === "string" && record.error) ||
        `Request failed (${status})`;
      return { ok: false, data: record, status, message };
    }
    return { ok: true, data, status };
  } catch {
    const preview = text.replace(/\s+/g, " ").slice(0, 120);
    const isNgrokOffline =
      preview.includes("offline") || preview.includes("ERR_NGROK");

    console.error("[laravel] Non-JSON response:", {
      status,
      url: response.url,
      preview,
    });

    return {
      ok: false,
      data: {},
      status,
      message: isNgrokOffline
        ? "API is unreachable. Start Laravel and your tunnel, then check API_URL in .env.local."
        : `Invalid API response (${status}): ${preview}`,
    };
  }
}

/**
 * Cookie options for the auth_token.
 * HttpOnly prevents JS access (XSS protection).
 * SameSite=Lax allows redirect-based flows.
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};
