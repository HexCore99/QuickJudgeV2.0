import React from "react";
import PublicLayout from "../../components/layout/PublicLayout";
import HeroSection from "../../components/landings/HeroSection";
import FeatureSection from "../../components/landings/FeatureSection";
import EdicationSection from "../../components/landings/EdicationSection";
import CTASection from "../../components/landings/CTASection";


export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <EdicationSection />
      <CTASection />
    </>
  );
}
