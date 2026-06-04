import { CTASection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import HeroSection from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
