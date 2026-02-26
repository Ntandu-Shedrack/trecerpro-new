import { CTASection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { Footer } from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import Navbar from "@/components/sections/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}
