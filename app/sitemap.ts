import type { MetadataRoute } from 'next';
import { publishedProjects } from '@/lib/content';

const BASE = 'https://janncarl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date() },
    ...['projects', 'stack', 'services', 'about', 'experience', 'resources', 'contact'].map((view) => ({
      url: `${BASE}/${view}`,
      lastModified: new Date(),
    })),
    ...publishedProjects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
