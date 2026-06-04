"use server";

import OnBoardingFooter from "@/components/sections/onboarding/onboarding-footer";

export default async function OnBoardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 flex items-center justify-center py-10 px-4 md:px-8">
        {children}
      </main>
      <OnBoardingFooter />
    </div>
  );
}
