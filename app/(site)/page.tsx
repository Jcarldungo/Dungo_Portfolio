import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { StackSection } from '@/components/sections/StackSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { HeroIntroGate } from '@/components/HeroIntroGate';
import { IntroGateController } from '@/components/IntroGateController';
import { HashScrollFallback } from '@/components/HashScrollFallback';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return (
    <>
      <HeroIntroGate />
      <IntroGateController />
      <HashScrollFallback />
      <HeroSection />
      <ProjectsSection />
      <StackSection />
      <AboutSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
