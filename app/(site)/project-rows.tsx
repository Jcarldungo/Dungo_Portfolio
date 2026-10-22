import Image from 'next/image';
import Link from 'next/link';
import { publishedProjects, type Project } from '@/lib/content';

const pillLabel: Partial<Record<Project['status'], string>> = { 'in-progress': 'In progress', concept: 'Concept' };

const groups = [
  { label: 'Client projects', match: (p: Project) => p.status === 'client' },
  { label: 'Personal projects', match: (p: Project) => p.status !== 'client' },
];

/** The catalogue: published projects split into client and personal work. */
export function ProjectRows({ projects = publishedProjects }: { projects?: Project[] }) {
  return <>{groups.map(({ label, match }) => {
    const items = projects.filter(match);
    if (!items.length) return null;
    return <section className="pv-plist" key={label} aria-label={label}>
      <div className="pv-plist-head"><h2>{label}</h2><span>{String(items.length).padStart(2, '0')}</span></div>
      {items.map(project => <Link className="pv-plist-row" href={`/projects/${project.slug}`} key={project.slug}>
        {project.previewImage ? <Image src={project.previewImage} alt="" width={72} height={52} /> : <span className="pv-plist-thumb" aria-hidden="true" />}
        <div>
          <h3>{project.title}{pillLabel[project.status] && <span className="pv-plist-pill">{pillLabel[project.status]}</span>}</h3>
          <p>{project.shortDesc ?? project.lede}</p>
        </div>
        <span className="pv-plist-kind">{project.category.split(' · ')[0]}</span>
      </Link>)}
    </section>;
  })}</>;
}
