import { HomeTabs } from "@/components/HomeTabs";
import { HeroSection } from "@/components/Hero-section";
import { SuccessStories } from "@/components/success-stories";
import { SupportSection } from "@/components/SupportSection";
import { ImpactSection } from "@/components/ImpactSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <HowItWorksSection />
        <HomeTabs />
        <ImpactSection />
        <SuccessStories />
        <SupportSection />
      </main>
    </div>
  );
}
