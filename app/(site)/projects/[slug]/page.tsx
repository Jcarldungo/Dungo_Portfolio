import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, publishedProjects } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `/projects/${project.slug}`;
  return {
    title: `${project.title} — ${project.category}`,
    description: project.lede,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — how it's built`,
      description: project.lede,
      url,
      images: [{ url: project.previewImage ?? project.heroImage ?? '/images/og-image.jpg', alt: `${project.title} screenshot` }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <article className="pv-detail"><Link className="pv-back" href="/projects">← All projects</Link><h1 className="pv-page-title">{project.title}</h1><p className="pv-intro">{project.lede}</p>
    <div className="pv-project-meta"><span>{project.category} · {project.status === 'in-progress' ? 'In progress' : 'Live'}</span><div>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Visit ↗</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}</div></div>
    <div className="pv-gallery">{project.screens?.map(screen => <figure key={screen.src}><Image src={screen.src} alt={`${project.title}: ${screen.label}`} width={1200} height={800} /><figcaption><strong>{screen.label}</strong> — {screen.caption}</figcaption></figure>)}</div>
    <section className="pv-block"><h2>The build</h2>{project.theBuild?.map(p => <p key={p}>{p}</p>)}</section>
    <div className="pv-facts">{project.stats?.map(stat => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
    {([['What it does', project.whatItDoes], ['Under the hood', project.underTheHood]] as const).map(([title, points]) => <section className="pv-block" key={title}><h2>{title}</h2>{points?.map(point => <div className="pv-point" key={point.title}><h3>{point.title}</h3><p>{point.desc}</p></div>)}</section>)}
    <section className="pv-block"><h2>Outcome</h2><ul>{project.outcome?.map(p => <li key={p}>{p}</li>)}</ul></section>
    <section className="pv-block"><h2>Built with</h2><p>{project.builtWith?.join(' · ')}</p><h3>Built for</h3><p>{project.builtFor?.join(' · ')}</p><h3>Roles</h3><p>{project.roles?.join(' · ')}</p></section>
  </article>;
}
