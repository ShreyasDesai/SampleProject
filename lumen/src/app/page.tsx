import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { Pillars } from "@/components/landing/Pillars";
import { WorkspaceCTA } from "@/components/landing/WorkspaceCTA";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Pillars />
        <HowItWorks />
        <WorkspaceCTA />
      </main>
      <Footer />
    </>
  );
}
