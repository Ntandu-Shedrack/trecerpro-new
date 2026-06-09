import OnBoardingFooter from "@/components/sections/onboarding/onboarding-footer";

export default async function OnBoardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <main className="flex-1 flex items-center justify-center py-10 px-4 md:px-8 relative z-10">
        {children}
      </main>
      <div className="relative z-10">
        <OnBoardingFooter />
      </div>
    </div>
  );
}
