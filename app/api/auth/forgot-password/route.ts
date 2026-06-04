import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/auth/api-proxy";

/**
 * POST /api/auth/forgot-password
 *
 * Sends a password reset link to the user's email via Laravel.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required" },
        { status: 400 }
      );
    }

    const laravelRes = await laravelFetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    });

    const parsed = await parseLaravelJson<{ message?: string }>(laravelRes);

    if (!parsed.ok) {
      return NextResponse.json(
        { message: parsed.message },
        { status: parsed.status >= 400 ? parsed.status : 502 }
      );
    }

    return NextResponse.json({
      message:
        parsed.data.message ||
        "Password reset link sent. Please check your email.",
    });
  } catch (error) {
    console.error("[auth/forgot-password] error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
