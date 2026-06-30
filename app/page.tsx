import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { MapPreviewSection } from "@/components/landing/MapPreviewSection"
import { AIDemoSection } from "@/components/landing/AIDemoSection"
import { MissionsSection } from "@/components/landing/MissionsSection"
import { CommunityHeroesSection } from "@/components/landing/CommunityHeroesSection"
import { ImpactPreviewSection } from "@/components/landing/ImpactPreviewSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
 return (
 <main className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
 <LandingNavbar />
 
 <HeroSection />
 
 <HowItWorksSection />
 
 <AIDemoSection />
 
 <MapPreviewSection />
 
 <MissionsSection />
 
 <CommunityHeroesSection />
 
 <ImpactPreviewSection />
 
 <TestimonialsSection />
 
 <CTASection />
 
 <Footer />
 </main>
 );
}
