import { NextRequest, NextResponse } from "next/server";
import {
  clientStatusForLaravelError,
  laravelFetch,
  parseLaravelJson,
} from "@/lib/auth/api-proxy";

/**
 * POST /api/auth/reset-password
 *
 * Proxies a password reset to Laravel (HttpOnly cookie auth is not required).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      token?: string;
      password?: string;
      password_confirmation?: string;
    };

    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";
    const password_confirmation =
      typeof body.password_confirmation === "string"
        ? body.password_confirmation
        : "";

    if (!token) {
      return NextResponse.json({ message: "Reset token is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 });
    }
    if (!password_confirmation) {
      return NextResponse.json(
        { message: "Password confirmation is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      token,
      password,
      password_confirmation,
    };
    if (body.email && typeof body.email === "string") {
      payload.email = body.email;
    }

    // Be resilient to different Laravel implementations/paths.
    const candidates = ["/api/reset-password", "/api/password/reset"];

    let lastError:
      | { status: number; message: string }
      | undefined = undefined;

    for (const endpoint of candidates) {
      const laravelRes = await laravelFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        skipAuth: true,
      });

      const parsed = await parseLaravelJson<{ message?: string }>(
        laravelRes
      );

      if (parsed.ok) {
        return NextResponse.json(
          {
            message:
              parsed.data.message ||
              "Password reset successful. Please sign in.",
          },
          { status: 200 }
        );
      }

      if (parsed.status === 404 || parsed.status === 405) {
        lastError = { status: parsed.status, message: parsed.message };
        continue;
      }

      return NextResponse.json(
        { message: parsed.message },
        { status: clientStatusForLaravelError(parsed) }
      );
    }

    return NextResponse.json(
      { message: lastError?.message || "Reset failed" },
      { status: lastError?.status || 502 }
    );
  } catch (error) {
    console.error("[auth/reset-password] error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

