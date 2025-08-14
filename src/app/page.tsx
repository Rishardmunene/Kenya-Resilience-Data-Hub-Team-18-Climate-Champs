import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { NewsSection } from '@/components/landing/NewsSection';
import { ContactSection } from '@/components/landing/ContactSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <PartnersSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
