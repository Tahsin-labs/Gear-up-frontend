import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryCards } from "@/components/home/CategoryCards";
import { FeaturedGearGrid } from "@/components/home/FeaturedGearGrid";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryCards />
        <FeaturedGearGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
