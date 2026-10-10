# CHANGELOG.md

An unofficial weekly newspaper about the IMD swarm, for readers who do not need to know how the technology works.

Issue **001** covers **Monday 28 September, 00:00 UTC, through Sunday 4 October 2026, 24:00 UTC**. Its issue date is **5 October 2026**. The job ran on 10 October. There were no earlier issue files or existing website in the supplied repository.

The finished static site is in [`dist/`](dist/). It includes the full latest paper as HTML, every issue’s embedded data, local application assets, the RSS feed and runtime license notices. It uses no API, wallet, analytics, tracker, external script or persistent browser storage. Only the requested Google Fonts are fetched externally; serif and sans-serif fallbacks work without them.

## Install and preview

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

For the finished export:

```sh
npm run build
npm run preview
```

Open the local URL printed by Vite. Serve the export over HTTP rather than opening it as a `file:` URL, because the browser loads a local JavaScript module. The latest paper’s text is pre-rendered and remains readable without JavaScript; switching editions, the sources switch and glossary dialogs need JavaScript.

## Rebuild and check

```sh
npm run typecheck
npm run check
npm run build
npx playwright install chromium
npm test
```

`typecheck` runs TypeScript without emitting files. `check` validates the exact issue schema, issue index, allowed links, a basic prohibited-language screen and the saved reporting evidence. These checks supplement human editorial review; they do not prove the truth of a story.

`build` regenerates `issues/index.json` and `feed.xml`, pre-renders the newest edition and embeds all editions in `dist/index.html`. Vite bundles the application with `base: './'`. The build does not contact IMD and does not need `.imd/`, `test/scratch/` or any credentials.

`test` runs a bounded, self-contained HTTP preview at a nested path, tests the production export in Chromium and closes the browser and server. It also builds a separate three-edition fixture in `test/scratch/archive-fixture/` to check archive navigation and empty sections. **These fictional test editions never enter `issues/` or the production export.** Screenshots and actual results go to `artifacts/`. If Chromium is already installed elsewhere, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable. `npm test -- --review` keeps the preview open for a manual check in an interactive terminal, until Enter/EOF or ten minutes.

Dependencies, browser downloads, caches and the temporary fixtures are development files. Do not include `node_modules/` at any nesting level, caches or `test/scratch/` in a submission. No ignore file was created or changed in this assignment. To respect the task’s protected paths, this run installed and built in an external mirror at `/tmp/imd-changelog-build`, with the npm cache at `/tmp/imd-npm-cache`; neither is part of the deliverable.

## Publish

Upload **the contents of `dist/`**, preserving its `assets/` directory, to the chosen static host. Root hosting and nested paths both work. No backend, rewrite rule, build service or secret is required. The contributor publisher should serve the supplied export rather than rebuild it.

Edition permalinks are `#no1`, `#no2`, and so on. The tabs follow newest-first order, show `Latest` on the newest issue, scroll horizontally on small screens and support Left/Right, Home and End keys. Browser Back/Forward restores the selected edition.

The deployment URL was not supplied. The RSS feed therefore links each item to its lead’s real API source and uses the real IMD homepage as the channel link; it does not invent a publication address. Once the actual public paper URL is known, rebuild with `PAPER_SITE_URL` set to that HTTPS URL. The feed will then link each item to the paper’s `#noN` anchor. This optional build setting changes no issue file and requires no `.env` file. The visible RSS link and discovery metadata always use the relative `./feed.xml` file.

## Add the next issue

1. Determine the most recent **completed** Monday-to-Sunday week in UTC. Count the numbered issue files and create the next three-digit filename. Never edit or delete an earlier issue.
2. Read IMD’s public API with a distinct User-Agent. Review original reports and signed answers. Exclude spam, copies and offensive projects; empty editorial sections are supported. Keep story prose free of technical identifiers and financial promotion.
3. Follow the exact structure in `issues/001.json`. Add corresponding reporting notes in `evidence/NNN.json`, including the watch item’s API source (the fixed issue schema has no `watch.source` field). Keep source extracts or compact counting evidence under `artifacts/` when needed.
4. Run `npm run build` to update the index/feed, then run the other checks. Submit the new issue, updated index/feed, reporting evidence and rebuilt `dist/`. Preserve the established site design and code for ordinary subsequent editions.

The build derives the whole archive from numbered files in `issues/`; there is no hand-maintained issue list in the application. The JSON payload is escaped for an HTML script-data context, and story prose is rendered as text, never as HTML.

## Reporting definitions and limitations

The API’s `/steps/hourly` endpoint only exposes the most recent 24 hours. Historical date/hour query parameters were ignored. **Issue 001’s `numbers.accepted` is consequently a completed-job count, not an accepted-step total.** The visible label is “Completed jobs,” and “How we counted” explains the definition. The Swarm-o-Meter uses the same completed-job measure for both weeks, so the comparison is consistent.

There were **4,517** completed jobs with their last recorded update in the covered week, versus **2,861** in the preceding week: **58% more**, giving meter level **79**. There were **44** launch records first recorded during the week and marked live, and **3,920** questions signed during the week. Online (**898**) and the three leading seats are explicitly dated reporting-time/lifetime snapshots, not historical weekly counts. “Online” counts connected helpers, not unique people or computers. Seat totals count accepted contributions, not distinct jobs.

See [`artifacts/reporting.md`](artifacts/reporting.md) for endpoint semantics, pagination, selection, answer decoding and limitations. Saved evidence permits the included checker to reproduce the arithmetic without network access. It does not turn the current API into a historical event ledger, verify the authenticity of signatures cryptographically or establish that the linked third-party sites work safely.

## Actual validation

On 10 October 2026, the worker ran the production build, TypeScript check, content/evidence checks and **53 Chromium interaction checks**. These passed on the final source. Automated accessibility checks had zero violations at **1440, 1024, 768, 390 and 320 CSS pixels**, and in the glossary dialog. The production export was also opened in the supplied browser at **1280 × 720**; source visibility, glossary opening/Escape/focus return, loaded fonts and network/console output were inspected.

The checks cover direct issue links, whole-paper archive changes, keyboard tabs, browser history, disclosures, definitions, source visibility, offline reading, fallback fonts, relative assets, RSS ordering, unknown issue links and empty sections. A real 200% text-enlargement overflow was fixed and rechecked. All six measured foreground/background pairs exceeded 4.5:1. Network checks found only Google Fonts outside the local export, with no failed application resources or console errors.

This is worker-side validation, not independent certification. Screen-reader use, native browser zoom, physical devices, Firefox/Safari, forced-colors rendering and print output were not tested. No live deployment was performed. Full coverage, findings, commands and screenshots are in [`artifacts/validation.md`](artifacts/validation.md) and [`artifacts/interaction-results.json`](artifacts/interaction-results.json).

## Source map

| Path | Purpose |
| --- | --- |
| `issues/` | Immutable numbered editions and generated newest-first index |
| `evidence/` | Per-edition notes embedded into the paper, including count definitions and source links |
| `src/App.tsx` | Newspaper, issue navigation, native disclosures and glossary dialog |
| `src/styles.css` | Newsprint design, responsive layouts and interaction states |
| `scripts/content.mjs` | Schema validation, archive loading, index and RSS generation |
| `scripts/check-evidence.mjs` | Recalculates issue 001’s saved evidence |
| `scripts/test-site.mjs` | Production browser and temporary archive validation |
| `vite.config.ts` | Static pre-rendering and safe, build-time data embedding |
| `public/` | Local favicon and runtime license notices |
| `dist/` | Finished, directly publishable static export |
| `DESIGN.md` | Implemented tokens, typography, components and responsive rules |
| `artifacts/` | Reporting trail, review, real check results and screenshots |

Design review used the assignment’s pinned Better Interface reference. Attribution and licenses are retained in [`artifacts/THIRD-PARTY-NOTICES.md`](artifacts/THIRD-PARTY-NOTICES.md). Runtime library licenses are also included in the export.
