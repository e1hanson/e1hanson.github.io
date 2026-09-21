import { getCollection, type CollectionEntry } from 'astro:content';
import { isFinalStage } from '../data/stages';

export type Project = CollectionEntry<'projects'>;

// Черновики (`draft: true`) видны только в режиме разработки и на сайт не попадают.
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
}

export function inProgress(projects: Project[]) {
  return projects.filter(({ data }) => !isFinalStage(data.track, data.stage));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
