import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/auth/api-proxy";

/**
 * POST /api/organizations
 *
 * Creates a new organization for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const laravelRes = await laravelFetch("/api/organizations", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await laravelRes.json().catch(() => ({}));

    if (!laravelRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create organization" },
        { status: laravelRes.status }
      );
    }

    const response = NextResponse.json(data);
    const orgId = data.data?.id || data.id;
    if (orgId) {
      response.cookies.set("active_organization_id", String(orgId), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
    return response;
  } catch (error) {
    console.error("[organizations] POST error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
