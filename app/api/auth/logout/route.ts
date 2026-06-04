import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { laravelFetch } from "@/lib/auth/api-proxy";

export async function POST() {
  try {
    // Best-effort call to invalidate the token on the Laravel side
    await laravelFetch("/api/logout", { method: "POST" });
  } catch {
    // Proceed with local logout even if the server call fails
  }

  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("active_organization_id");

  return NextResponse.json({ success: true });
}
