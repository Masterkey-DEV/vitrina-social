import { HomeTabs } from "@/components/HomeTabs";
import { HeroSection } from "@/components/Hero-section";
import { SuccessStories } from "@/components/success-stories";
import { SupportSection } from "@/components/SupportSection";


export default function Page() {
  return (
    <div className="min-h-screen bg-background mx-auto">
      <main>
        <HeroSection /> 
        <HomeTabs /> 
        <SuccessStories />
        <SupportSection />
      </main>
    </div>
  );
}
