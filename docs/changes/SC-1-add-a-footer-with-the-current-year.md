## Summary

Add a current-year footer to every page

## What changed

- Added a small semantic footer to the shared app shell and styled it below the main content.
- Added route, year and layout-style tests.

## Decisions

The footer uses the browser's local year at render time. The existing column flex layout grows the main area on short pages; the footer remains in normal flow on long pages rather than being fixed over content.

## How each criterion is met

- Every page shows the requested text: `shows the current year on %s`, `shows the footer in the lobby and game after creating a room`, and `uses the local year at render time` in `AppShell.test.tsx`.
- Footer at the bottom without overlap: `uses a flowing flex layout that leaves space below content` checks the layout rules and element order. A Chromium layout check also measured short and scrolling desktop/mobile pages (jsdom does not calculate layout).

## How to verify

Run the backend and frontend as described in the README. Set `VITE_API_URL=http://localhost:3001` for the frontend if needed. Visit the pages, create a room and open the game; check the current-year footer at the bottom, including at a narrow viewport and when scrolling.

## Tests

- Added seven cases in `frontend/src/components/AppShell.test.tsx`, covering all routes, two years, and the flex/flow layout rules.
- Frontend `npm test`: final run passed, 14 tests. Earlier runs failed while setting up the stylesheet test (CSS handling, file URL and flex serialization); corrected in the test setup.
- Backend `npm test`: passed, 4 tests.
- Frontend and backend `npm run build`: passed, including TypeScript compilation. An earlier frontend build failed on a test-only Node import, subsequently removed.
- `npx tsc --noEmit` in frontend and `npx tsc --noEmit -p tsconfig.json` in backend: passed.
- `npm run lint` in both projects: unavailable, neither package defines a lint script.
- Chromium check: passed for a short create page and long game page at desktop and mobile widths, measuring footer position against main content and viewport. Initial attempt could not reach the lobby using the starter's default API URL; reran with `VITE_API_URL` set to the backend.
- An initial root-level `npm test` failed because there is no root package; both package suites were run separately as above.

## Docs updated

Updated `README.md` current implementation and quick verification. No API or agent instruction changes were needed.

## Open questions

None.
