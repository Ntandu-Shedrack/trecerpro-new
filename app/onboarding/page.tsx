import { OnboardingFlow } from "@/components/forms/OnBoardingForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function OnBoardingPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  if (session.orgId) {
    redirect("/dashboard/overview");
  }

  return (
    <>
      <OnboardingFlow
        userName={session.user.name}
        userEmail={session.user.email}
      />
    </>
  );
}
