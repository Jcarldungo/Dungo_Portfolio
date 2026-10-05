import Image from 'next/image';
import Link from 'next/link';
import { siteInfo, techGroups } from '@/lib/content';
import { ProjectRows } from './project-rows';
import { GitHubActivity } from './github';
import { ResumeLink } from '@/components/ResumeLink';

export default function Home() {
  return <>
    <div className="pv-profile"><Image src="/images/profile.jpg" alt={siteInfo.name} width={80} height={80} priority /><div><strong>{siteInfo.name}</strong><span>Software Engineer · Pampanga, PH</span></div></div>
    <h1 className="pv-hero-title">I design and build<br />structured <em>full-stack systems.</em></h1>
    <p className="pv-intro">I work across the whole stack: schema first, then the API, then an interface that holds up on a slow phone. Right now that means a production Laravel and React rewrite at my internship, and an offline-first expense tracker I built and ship myself.</p>
    <div className="pv-actions"><Link href="/projects">View my work <span>↗</span></Link><Link href="/contact">Let&apos;s connect <span>↗</span></Link><ResumeLink>Résumé (PDF) <span>↗</span></ResumeLink></div>
    <div className="pv-availability"><span className="pv-dot" />Open to internships &amp; freelance work</div>
    <div className="pv-education"><span>BSIT — Web Development</span><span>Holy Angel University</span><span>Dean&apos;s Lister (2023–present)</span></div>
    <section className="pv-block"><div className="pv-section-heading"><h2>Projects</h2><Link href="/projects">View all ↗</Link></div><ProjectRows /></section>
    <section className="pv-block"><div className="pv-section-heading"><h2>Stack</h2><Link href="/stack">View all ↗</Link></div>{techGroups.map(group => <div className="pv-stack-summary" key={group.label}><h3>{group.label}</h3><p>{group.tools.map(t => t.name).join(', ')}</p></div>)}</section>
    <GitHubActivity />
    <div className="pv-closing"><p>Open to internship opportunities, freelance full-stack projects, and academic collaborations.</p><Link href="/contact">Let&apos;s connect ↗</Link></div>
  </>;
}
