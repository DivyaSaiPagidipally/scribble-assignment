# Summary

Show the starter build footer on every page

## What changed

- Added a semantic footer to the shared app shell and spaced it below the main content.
- Added the requested `Site footer` accessible label.
- Added route coverage and a phone-width Chromium layout test. Ignored Playwright output.

## Decisions

The shared shell covers all routes without duplicating the label. The footer remains in normal flow so long pages can scroll. The browser test stubs room creation to exercise the lobby and game without a running backend.

## How each criterion is met

1. `app shell footer > shows the build label on %s` verifies the exact text and `Site footer` aria-label on all five routes with a seeded room.
2. `footer stays below each page's content at phone width` checks the footer's bounds and separation from main content on all five pages at 320px in Chromium.

## How to verify

In `frontend`, run `npm test`, install Chromium with `npx playwright install chromium`, and run `npm run test:browser`. Alternatively, open each page at phone width and scroll to the footer.

The separately added `e2e/regression/footer/sc-12-show-a-footer-on-every-page.spec.ts` needs a Playwright config with `testDir: "../e2e/regression"` and `baseURL: "http://127.0.0.1:5173"`. Start the backend and frontend as in CONTRIBUTING (with `VITE_API_URL=http://localhost:3001`), then from `frontend` run `NODE_PATH="$PWD/node_modules" npx playwright test --config <config-path>` with that config in `frontend`. The existing browser config only discovers `frontend/browser-tests`.

## Tests

- Added five route cases: focused Vitest run failed for the missing footer, then passed 5/5. After adding the aria-label assertion, `npm test -- src/routes/index.test.tsx` failed 5/5 for the missing label, then passed 5/5 after the fix.
- Added the Chromium layout test: first run failed on missing spacing; after styling, passed 1/1 using `PLAYWRIGHT_BROWSERS_PATH=/opt/factory-browsers/playwright npm run test:browser`.
- Re-ran the added regression suite with a temporary frontend Playwright config, `NODE_PATH` pointing at frontend dependencies, and real backend/frontend servers: `SC-12 TC-01 Show the labelled build footer on every page` passed 1/1. This includes the requested accessible label on all five pages.
- Latest frontend full `npm test`: 19 passed. Backend full `npm test`: 13 passed. React Router emitted existing future-flag warnings.
- Latest `PLAYWRIGHT_BROWSERS_PATH=/opt/factory-browsers/playwright npm run test:browser`: 1 passed at 320px across all five pages.
- Both `npm run build` commands passed, including TypeScript checks. Neither package defines a lint script or lint configuration.
- An accidental root `npm test` failed because the root has no package.json; the package-specific suites above passed.
- `npm install` reported 14 dependency audit vulnerabilities; no audit fixes were applied.

## Docs updated

README already describes the footer, its accessible label, and browser test setup. This change note records the latest verification; no other documentation needed changes.

## Open questions

None.
