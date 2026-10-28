import { readFile, writeFile, rename } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const definitions = JSON.parse(await readFile(new URL('src/data/projects.json', root), 'utf8'));
const destination = new URL('src/data/github.json', root);
const snapshot = JSON.parse(await readFile(destination, 'utf8'));
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);
  return response.json();
}

const results = await Promise.allSettled(
  definitions.map(async ({ repo }) => {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`Invalid repository: ${repo}`);
    const [metadata, commits] = await Promise.all([
      github(`/repos/${repo}`),
      github(`/repos/${repo}/commits?per_page=1`),
    ]);
    const updatedAt = commits[0]?.commit?.committer?.date;
    if (!Number.isFinite(Date.parse(updatedAt)) || !Number.isInteger(metadata.stargazers_count)) {
      throw new Error(`Invalid metadata for ${repo}`);
    }
    return [
      repo,
      {
        stars: metadata.stargazers_count,
        language: metadata.language || null,
        license:
          metadata.license?.spdx_id === 'NOASSERTION' ? null : (metadata.license?.spdx_id ?? null),
        homepage: metadata.homepage || null,
        updatedAt,
      },
    ];
  }),
);

for (const [index, result] of results.entries()) {
  const repo = definitions[index].repo;
  if (result.status === 'fulfilled') {
    const [key, value] = result.value;
    snapshot[key] = value;
    console.log(`Updated ${key}`);
  } else {
    if (!snapshot[repo]) throw result.reason;
    console.warn(`Using saved metadata for ${repo}: ${result.reason.message}`);
  }
}

const next = Object.fromEntries(definitions.map(({ repo }) => [repo, snapshot[repo]]));
const temporary = new URL('src/data/github.json.tmp', root);
await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`);
await rename(temporary, destination);
