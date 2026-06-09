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

    const laravelRes = await laravelFetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
        password_confirmation: body.password,
        device_name: body.device_name || userAgent,
      }),
      skipAuth: true,
    });

    const parsed = await parseLaravelJson<Record<string, unknown>>(laravelRes);

    if (!parsed.ok) {
      console.error("[auth/register] Laravel registration failed:", parsed);
      return NextResponse.json(
        { message: parsed.message, errors: parsed.data.errors },
        { status: clientStatusForLaravelError(parsed) }
      );
    }

    const token = extractAuthToken(parsed.data);
    const user = parsed.data.user as any;

    if (!token) {
      return NextResponse.json(
        { message: "Registration failed: no token returned" },
        { status: 500 }
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
    console.error("[auth/register] error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
