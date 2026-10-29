# Site maintenance

`npm run verify` checks sponsor synchronization, runs the tests, and verifies the
Astro build, bilingual routes, links, and assets.

`npm run sync:sponsors` uses `GITHUB_TOKEN` to fetch current, public GitHub
sponsors. It writes `src/data/sponsors.json` and updates only the section between
the sponsor markers in the root Profile README. The website reads that same JSON.
Avatar URLs are used directly; images, sponsorship amounts, and private records
are never stored. API failures leave the existing files intact.

Use `npm run sync:sponsors -- --offline` to regenerate the README from the saved
data, or `npm run sync:sponsors -- --check` to check it without network access or
file changes. Edit the rest of the Profile README normally.

The Site workflow runs on pushes to `main`, manually, and daily at 03:37 UTC.
It uses the repository's `GITHUB_TOKEN`; no extra secret or service is required.
Scheduled runs with unchanged sponsor data stop before dependency installation
and deployment. Changed data is checked, committed, and deployed in the same run,
because bot pushes do not start another workflow. Concurrent runs are serialized;
a conflicting remote push fails safely and the following run uses the latest main.

The old SponsorKit outputs remain in the archived `medz/public` repository.
