import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const dataFile = new URL('src/data/sponsors.json', root);
const readmeFile = new URL('README.md', root);
const start = '<!-- sponsors:start -->';
const end = '<!-- sponsors:end -->';
const query = `query Sponsors($after: String) {
  user(login: "medz") {
    sponsorshipsAsMaintainer(
      first: 100, after: $after, includePrivate: false, activeOnly: true,
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      nodes {
        sponsorEntity {
          ... on User { login name avatarUrl(size: 104) websiteUrl }
          ... on Organization { login name avatarUrl(size: 104) websiteUrl }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

function websiteUrl(value) {
  if (!value?.trim()) return null;
  value = value.trim();
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export async function fetchSponsors(token) {
  assert(token, 'Set GITHUB_TOKEN to sync public sponsors.');
  const sponsors = new Map();
  const cursors = new Set();
  let after = null;
  do {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { after } }),
      signal: AbortSignal.timeout(15_000),
    });
    assert(response.ok, `GitHub returned HTTP ${response.status}`);
    const result = await response.json();
    assert(!result.errors?.length, result.errors?.map((error) => error.message).join('; '));
    const connection = result.data?.user?.sponsorshipsAsMaintainer;
    assert(Array.isArray(connection?.nodes), 'GitHub did not return a sponsor list.');
    assert.equal(typeof connection.pageInfo?.hasNextPage, 'boolean', 'Missing pagination data.');
    for (const { sponsorEntity: sponsor } of connection.nodes) {
      if (!sponsor) continue; // Deleted accounts have no public profile.
      assert(typeof sponsor.login === 'string' && /^[a-z\d-]+$/i.test(sponsor.login),
        'Invalid GitHub sponsor login.');
      const avatar = new URL(sponsor.avatarUrl);
      assert(avatar.protocol === 'https:' && avatar.hostname === 'avatars.githubusercontent.com');
      const key = sponsor.login.toLowerCase();
      if (!sponsors.has(key)) sponsors.set(key, {
        login: sponsor.login,
        name: sponsor.name?.trim() || sponsor.login,
        avatarUrl: avatar.href,
        websiteUrl: websiteUrl(sponsor.websiteUrl),
      });
    }
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
    assert(after && !cursors.has(after), 'Invalid GitHub pagination cursor.');
    cursors.add(after);
  } while (true);
  return [...sponsors.values()];
}

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export function renderSponsors(sponsors) {
  if (!sponsors.length) return 'Your support helps me keep building open-source tools.';
  const people = sponsors.map(({ login, name, avatarUrl, websiteUrl }) => {
    const profile = `https://github.com/${login}`;
    return `  <a href="${profile}"><img src="${escape(avatarUrl)}" width="36" height="36" alt="" align="middle">&nbsp;<strong>${escape(name)}</strong></a>${websiteUrl ? `&nbsp;·&nbsp;<a href="${escape(websiteUrl)}">Website</a>` : ''}`;
  });
  return `<p>\n${people.join('&nbsp;\n')}\n</p>`;
}

export function updateReadme(readme, sponsors) {
  assert(readme.split(start).length === 2 && readme.split(end).length === 2,
    'README needs exactly one pair of sponsor markers.');
  const before = readme.indexOf(start);
  const after = readme.indexOf(end);
  assert(before < after, 'README sponsor markers are reversed.');
  return `${readme.slice(0, before + start.length)}\n\n${renderSponsors(sponsors)}\n\n${readme.slice(after)}`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2];
  assert(!mode || ['--offline', '--check'].includes(mode), 'Use --offline or --check.');
  const sponsors = mode
    ? JSON.parse(await readFile(dataFile, 'utf8'))
    : await fetchSponsors(process.env.GITHUB_TOKEN);
  const readme = await readFile(readmeFile, 'utf8');
  const nextReadme = updateReadme(readme, sponsors);
  if (mode === '--check') {
    assert.equal(readme, nextReadme, 'Run npm run sync:sponsors -- --offline to update README.');
  } else {
    // Fetch and render completely before replacing either file.
    if (!mode) await writeFile(dataFile, `${JSON.stringify(sponsors, null, 2)}\n`);
    if (readme !== nextReadme) await writeFile(readmeFile, nextReadme);
  }
  console.log(`${mode === '--check' ? 'Verified' : 'Synced'} ${sponsors.length} public sponsors.`);
}
