import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { StackSection } from '@/components/sections/StackSection';
import { ProjectRows } from '../project-rows';
import { Resources } from '../resources';
import { Services } from '../services';

const titles: Record<string, string> = {
  services: 'Services', resources: 'Resources', projects: 'Projects', about: 'About me',
  stack: 'Stack', experience: 'Experience & credentials', contact: "Let's connect",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(titles).map(view => ({ view }));
}

export async function generateMetadata({ params }: { params: Promise<{ view: string }> }): Promise<Metadata> {
  const { view } = await params;
  return { title: titles[view], alternates: { canonical: `/${view}` } };
}

export default async function ViewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  const content: Record<string, React.ReactNode> = {
    services: <Services />,
    resources: <Resources />,
    projects: <><h1 className="pv-page-title">Projects</h1><ProjectRows /></>,
    about: <><h1 className="pv-page-title">About me</h1><AboutSection /></>,
    stack: <><h1 className="pv-page-title">Stack</h1><StackSection /></>,
    experience: <><h1 className="pv-page-title">Experience &amp; credentials</h1><ExperienceSection /></>,
    contact: <><h1 className="pv-page-title">Let&apos;s connect</h1><ContactSection /></>,
  };
  if (!content[view]) notFound();
  return <><Link className="pv-back" href="/">← Home</Link>{content[view]}</>;
}
