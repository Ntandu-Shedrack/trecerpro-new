import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/auth/api-proxy";

/**
 * POST /api/organizations/[orgId]/switch
 *
 * Switches the user's active organization.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    const laravelRes = await laravelFetch(
      `/api/organizations/${orgId}/switch`,
      { method: "POST" }
    );

    const data = await laravelRes.json().catch(() => ({}));

    if (!laravelRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to switch organization" },
        { status: laravelRes.status }
      );
    }

    const response = NextResponse.json(data);
    response.cookies.set("active_organization_id", orgId, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    return response;
  } catch (error) {
    console.error("[organizations/switch] POST error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
