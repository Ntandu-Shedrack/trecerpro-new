"use server";

import OnBoardingFooter from "@/components/sections/onboarding/onboarding-footer";
import OnboardingHeader from "@/components/sections/onboarding/onboarding-header";

export default async function OnBoardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {" "}
      <OnboardingHeader userName="Shedrack Ntandu" />
      {children}
      <OnBoardingFooter />
    </div>
  );
}
