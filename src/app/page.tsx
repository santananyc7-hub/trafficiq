import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { SocialProof } from "@/components/marketing/SocialProof";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { ProductReveal } from "@/components/marketing/ProductReveal";
import { ValueProps } from "@/components/marketing/ValueProps";
import { OpportunityEngine } from "@/components/marketing/OpportunityEngine";
import { AskTrafficIQ } from "@/components/marketing/AskTrafficIQ";
import { TrafficMapShowcase } from "@/components/marketing/TrafficMapShowcase";
import { Integrations } from "@/components/marketing/Integrations";
import { UseCases } from "@/components/marketing/UseCases";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Pricing } from "@/components/marketing/Pricing";
import { RoiCalculator } from "@/components/marketing/RoiCalculator";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <ProductReveal />
        <ValueProps />
        <OpportunityEngine />
        <AskTrafficIQ />
        <TrafficMapShowcase />
        <HowItWorks />
        <Integrations />
        <UseCases />
        <BeforeAfter />
        <RoiCalculator />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
