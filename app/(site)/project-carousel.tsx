import { cardTechOf, publishedProjects, type Project } from '@/lib/content';
import { ProjectFan, type FanItem } from './project-fan';

function externalLink(project: Project): FanItem['external'] {
  if (project.liveUrl?.startsWith('http')) return { href: project.liveUrl, label: new URL(project.liveUrl).hostname };
  if (project.liveUrl) return { href: project.liveUrl, label: 'Live demo' };
  if (project.githubUrl) return { href: project.githubUrl, label: 'GitHub' };
}

/** Slim, serialisable view of each project: the full case-study copy stays on the server. */
export function ProjectCarousel({ projects = publishedProjects }: { projects?: Project[] }) {
  const items: FanItem[] = projects.map(project => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    status: project.status,
    summary: project.shortDesc ?? project.lede,
    image: project.previewImage,
    tech: cardTechOf(project),
    external: externalLink(project),
  }));
  return <ProjectFan items={items} />;
}
