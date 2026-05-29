import { CTASection } from "@/components/sections/cta-section";
import FAQSection from "@/components/sections/pricing/FQAs";
import FeatureComparison from "@/components/sections/pricing/plan-features";
import PricingHero from "@/components/sections/pricing/pricing-hero";

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <FeatureComparison />
      <FAQSection />
      <CTASection />
    </>
  );
}
