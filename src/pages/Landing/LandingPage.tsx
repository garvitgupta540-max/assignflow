import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { FeaturesSection, StatsSection } from './FeaturesSection';
import { HowItWorksSection, TestimonialsSection, FAQSection } from './OtherSections';
import { FounderSection } from './FounderSection';
import { PricingSection, CTASection, Footer } from './PricingSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FounderSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
