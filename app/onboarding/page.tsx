import { OnboardingForm } from "@/components/forms/OnBoardingForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function OnBoardingPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  if (session.orgId) {
    const cookieStore = await cookies();
    cookieStore.set("active_organization_id", String(session.orgId), {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    redirect("/dashboard/overview");
  }

  return (
    <>
      <OnboardingForm
        userName={session.user.name}
        userEmail={session.user.email}
      />
    </>
  );
}
