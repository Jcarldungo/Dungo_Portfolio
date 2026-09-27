import Image from 'next/image';
import Link from 'next/link';
import { siteInfo, techGroups } from '@/lib/content';
import { ProjectRows } from './project-rows';
import { GitHubActivity } from './github';

export default function Home() {
  return <>
    <div className="pv-profile"><Image src="/images/profile.jpg" alt={siteInfo.name} width={58} height={58} priority /><div><strong>{siteInfo.name}</strong><span>Full-Stack Developer · Pampanga, PH</span></div></div>
    <h1 className="pv-hero-title">I design and build<br />structured <em>full-stack systems.</em></h1>
    <p className="pv-intro">From database architecture and backend APIs to responsive, production-ready interfaces. I&apos;m continuously learning, refining my craft, and looking to collaborate on meaningful projects.</p>
    <div className="pv-actions"><Link href="/projects">View my work <span>↗</span></Link><Link href="/contact">Let&apos;s connect <span>↗</span></Link><a href="/resume.pdf" download>Résumé (PDF) <span>↓</span></a></div>
    <div className="pv-availability"><span className="pv-dot" />Open to internships &amp; freelance work</div>
    <div className="pv-education"><span>BSIT — Web Development</span><span>Holy Angel University</span><span>Dean&apos;s Lister (2023–present)</span></div>
    <section className="pv-block"><div className="pv-section-heading"><h2>Projects</h2><Link href="/projects">View all ↗</Link></div><ProjectRows /></section>
    <section className="pv-block"><div className="pv-section-heading"><h2>Stack</h2><Link href="/stack">View all ↗</Link></div>{techGroups.map(group => <div className="pv-stack-summary" key={group.label}><h3>{group.label}</h3><p>{group.tools.map(t => t.name).join(', ')}</p></div>)}</section>
    <GitHubActivity />
    <div className="pv-closing"><p>Open to internship opportunities, freelance full-stack projects, and academic collaborations.</p><Link href="/contact">Let&apos;s connect ↗</Link></div>
  </>;
}
