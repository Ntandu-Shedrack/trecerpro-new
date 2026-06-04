import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  laravelFetch,
  AUTH_COOKIE_OPTIONS,
  parseLaravelJson,
  extractAuthToken,
  clientStatusForLaravelError,
} from "@/lib/auth/api-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get("user-agent") || "Web Client";
    const payload = {
      email: body.email,
      password: body.password,
      device_name: body.device_name || userAgent,
    };

    const laravelRes = await laravelFetch("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    const parsed = await parseLaravelJson<Record<string, unknown>>(laravelRes);

    if (!parsed.ok) {
      return NextResponse.json(
        { message: parsed.message },
        { status: clientStatusForLaravelError(parsed) }
      );
    }

    const token = extractAuthToken(parsed.data);
    const user = parsed.data.user as any;

    if (!token) {
      console.error("[auth/login] No token in Laravel response keys:", Object.keys(parsed.data));
      return NextResponse.json(
        {
          message:
            "Authentication succeeded but no token was returned. Check Laravel login response format.",
        },
        { status: 502 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, AUTH_COOKIE_OPTIONS);

    const activeOrgId = user.current_organization?.id || user.currentOrganization?.id || (user.organizations && user.organizations[0]?.id);
    if (activeOrgId) {
      cookieStore.set("active_organization_id", String(activeOrgId), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[auth/login] error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
