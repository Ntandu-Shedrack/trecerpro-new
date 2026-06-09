import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/onboarding"];
const authOnlyPrefixes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  let activeOrgId = request.cookies.get("active_organization_id")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect /login to /sign-in and /register to /sign-up
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  // 2. Redirect unauthenticated users away from protected routes
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Redirect already-authenticated users away from auth pages
  if (authOnlyPrefixes.some((prefix) => pathname.startsWith(prefix)) && token) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  // 4. Handle authenticated users who don't have an active organization cookie
  if (token && !activeOrgId) {
    try {
      const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://ungangrenous-endosporous-zainab.ngrok-free.dev";
      const userRes = await fetch(`${baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (userRes.ok) {
        const user = await userRes.json();
        const fallbackOrgId = user.current_organization?.id || user.currentOrganization?.id || (user.organizations && user.organizations[0]?.id);
        if (fallbackOrgId) {
          activeOrgId = String(fallbackOrgId);

          // If trying to access onboarding, redirect them to dashboard overview and set cookie
          if (pathname.startsWith("/onboarding")) {
            const response = NextResponse.redirect(new URL("/dashboard/overview", request.url));
            response.cookies.set("active_organization_id", activeOrgId, {
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 7 * 24 * 60 * 60,
            });
            return response;
          }

          // Otherwise let them access the dashboard but set the cookie on the response
          const response = NextResponse.next();
          response.cookies.set("active_organization_id", activeOrgId, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
          return response;
        }
      }
    } catch (e) {
      console.error("Failed to fetch user or verify organizations in proxy:", e);
    }
  }

  // 5. Redirect authenticated users accessing dashboard who don't have an active organization (even after checking database)
  if (
    token &&
    !activeOrgId &&
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 6. Redirect authenticated users who DO have an active organization away from onboarding
  if (
    token &&
    activeOrgId &&
    pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
