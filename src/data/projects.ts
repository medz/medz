import definitions from './projects.json';
import snapshot from './github.json';

interface RepositoryMetadata {
  stars: number;
  language: string | null;
  license: string | null;
  homepage: string | null;
  updatedAt: string;
}

export const projects = definitions
  .map((project) => {
    const metadata = (snapshot as Record<string, RepositoryMetadata>)[project.repo];
    if (!metadata) throw new Error(`Missing repository metadata: ${project.repo}`);
    const source = `https://github.com/${project.repo}`;
    const packageUrl = metadata.homepage?.startsWith('https://pub.dev/packages/')
      ? metadata.homepage
      : undefined;
    return {
      ...project,
      ...metadata,
      source,
      packageUrl,
      docsUrl: project.docs ?? `${source}#readme`,
    };
  })
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export type Project = (typeof projects)[number];
