"use server";

import OnBoardingFooter from "@/components/sections/onboarding/onboarding-footer";
import OnboardingHeader from "@/components/sections/onboarding/onboarding-header";
import { getSession } from "@/lib/auth/session";

export default async function OnBoardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <OnboardingHeader 
        userName={session?.user?.name || "User"} 
        userEmail={session?.user?.email} 
      />
      <main className="flex-1 flex items-center justify-center py-10 px-4 md:px-8">
        {children}
      </main>
      <OnBoardingFooter />
    </div>
  );
}
