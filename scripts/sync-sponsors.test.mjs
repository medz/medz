import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchSponsors, renderSponsors, updateReadme } from './sync-sponsors.mjs';

const person = {
  login: 'someone', name: 'Someone',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1?s=104&v=4',
  websiteUrl: 'example.com',
};
const page = (nodes, hasNextPage = false, endCursor = null) => Response.json({
  data: { user: { sponsorshipsAsMaintainer: {
    nodes: nodes.map((sponsorEntity) => ({ sponsorEntity })),
    pageInfo: { hasNextPage, endCursor },
  } } },
});

test('public sponsors paginate, deduplicate, and omit unsafe website links', async (t) => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.github.com/graphql');
    const request = JSON.parse(options.body);
    requests.push(request);
    assert.match(request.query, /includePrivate: false, activeOnly: true/);
    assert.doesNotMatch(request.query, /privacyLevel|isActive|tier/);
    return request.variables.after === null
      ? page([person, null], true, 'next')
      : page([
        { ...person, login: 'SOMEONE' },
        { ...person, login: 'another', name: null, websiteUrl: 'javascript:alert(1)' },
      ]);
  });
  const sponsors = await fetchSponsors('test-token');
  assert.deepEqual(requests.map(({ variables }) => variables.after), [null, 'next']);
  assert.deepEqual(sponsors, [
    { ...person, websiteUrl: 'https://example.com/' },
    { ...person, login: 'another', name: 'another', websiteUrl: null },
  ]);
});

test('API errors and incomplete pagination fail instead of returning a partial list', async (t) => {
  for (const response of [
    new Response('', { status: 503 }),
    Response.json({ errors: [{ message: 'Rate limited' }] }),
    Response.json({ data: { user: null } }),
    page([person], true, null),
  ]) {
    t.mock.method(globalThis, 'fetch', async () => response);
    await assert.rejects(fetchSponsors('test-token'));
    t.mock.restoreAll();
  }
  t.mock.method(globalThis, 'fetch', async () => page([person], true, 'same'));
  await assert.rejects(fetchSponsors('test-token'), /pagination cursor/);
});

test('README rendering escapes public text and preserves everything outside the managed block', () => {
  const readme = '# Intro\n\n<!-- sponsors:start -->\nOld content\n<!-- sponsors:end -->\n\nContact me.\n';
  const sponsors = [{ ...person, name: '<Someone & "Friends">', websiteUrl: null }];
  const next = updateReadme(readme, sponsors);
  assert(next.startsWith('# Intro\n\n<!-- sponsors:start -->'));
  assert(next.endsWith('<!-- sponsors:end -->\n\nContact me.\n'));
  assert.match(next, /&lt;Someone &amp; &quot;Friends&quot;&gt;/);
  assert.match(next, /src="https:\/\/avatars\.githubusercontent\.com\/u\/1\?s=104&amp;v=4"/);
  assert(!next.includes('Website'));
  assert.equal(updateReadme(next, sponsors), next);
  assert(!renderSponsors([]).includes('<table>'));
});

test('missing, duplicated, or reversed README markers are rejected', () => {
  for (const readme of [
    '# No markers',
    '<!-- sponsors:start --><!-- sponsors:start --><!-- sponsors:end -->',
    '<!-- sponsors:end --><!-- sponsors:start -->',
  ]) assert.throws(() => updateReadme(readme, []));
});
