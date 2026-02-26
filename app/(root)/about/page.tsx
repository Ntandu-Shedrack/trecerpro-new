import AboutHero from "@/components/sections/about-hero";
import { CTASection } from "@/components/sections/cta-section";
import StatsBar from "@/components/sections/stats";
import TargetAudience from "@/components/sections/target-audience";
import VisionSection from "@/components/sections/vision-section";
import React from "react";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StatsBar />
      <TargetAudience />
      <VisionSection />
      <CTASection />
    </>
  );
}
