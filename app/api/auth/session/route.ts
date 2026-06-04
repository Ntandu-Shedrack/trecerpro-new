import { NextResponse } from "next/server";
import {
  getAuthToken,
  laravelFetch,
  parseLaravelJson,
  clientStatusForLaravelError,
} from "@/lib/auth/api-proxy";

/**
 * GET /api/auth/session
 *
 * Proxies /api/user to Laravel using the HttpOnly auth_token cookie.
 */
export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const laravelRes = await laravelFetch("/api/user");

    if (laravelRes.status === 401) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const parsed = await parseLaravelJson(laravelRes);

    if (!parsed.ok) {
      return NextResponse.json(
        { message: parsed.message },
        { status: clientStatusForLaravelError(parsed) }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("[auth/session] error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
