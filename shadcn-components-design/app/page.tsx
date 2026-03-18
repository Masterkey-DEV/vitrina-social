import { HomeTabs } from "@/components/HomeTabs";
import { HeroSection } from "@/components/Hero-section";
import { SuccessStories } from "@/components/success-stories";
import { SupportSection } from "@/components/SupportSection";


export default function Page() {
  return (
    <div className="min-h-screen bg-background mx-auto">
      <main>
        <HeroSection /> {/* Hero una sola vez, fuera de los tabs */}
        <HomeTabs /> {/* Tabs sin tab "inicio" */}
        <SuccessStories />
        <SupportSection />
      </main>
    </div>
  );
}
