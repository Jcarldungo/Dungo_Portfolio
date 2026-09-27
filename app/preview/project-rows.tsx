import Image from 'next/image';
import Link from 'next/link';
import { publishedProjects } from '@/lib/content';

export function ProjectRows() {
  return <div className="pv-projects">{publishedProjects.map(project => <Link className="pv-project-row" href={`/preview/projects/${project.slug}`} key={project.slug}>
    {project.previewImage && <Image src={project.previewImage} alt={`${project.title} screenshot`} width={100} height={70} />}
    <div><h3>{project.title}</h3><p>{project.lede}</p><span>{project.category}</span></div><span className="pv-arrow" aria-hidden="true">↗</span>
  </Link>)}</div>;
}
