# Summary

Add a Privacy Policy page

## What changed

- Added `/privacy` with a heading and a description of room and player data handling.
- Registered the route in the existing app router and added direct-navigation tests.

## Decisions

The copy describes the current in-memory room implementation and snapshot access without making claims about hosting or external infrastructure. No API or storage behavior changed.

## How each criterion is met

1. `/privacy` shows the Privacy Policy heading: `shows the Privacy Policy heading on direct navigation to /privacy`.
2. The page explains data collection: `explains the room and player data collected on the privacy page`.

Both tests are in `frontend/src/routes/index.test.tsx` and render the actual app router.

## How to verify

Start the frontend as described in the README and visit `/privacy`. Run `npm test` and `npm run build` in both `frontend` and `backend`.

## Tests

- Added the two route tests above. The heading test initially failed because the wildcard redirected to the start page; it passed after the route was added. The paragraph test initially failed because there was no policy paragraph; it passed after the copy was added. The final focused run passed both tests.
- Frontend `npm test`: 16 passed; `npm run build`: passed, including TypeScript checking. React Router emitted v7 future-flag warnings.
- Backend `npm test`: 13 passed; `npm run build`: passed, including TypeScript checking.
- `npm run lint` in each app could not run: neither package defines a lint script or configured linter.
- An accidental root `npm test` failed because the repository has no root package.json; the actual app suites passed as above.
- Browser runtime verification was unavailable in this environment; direct navigation was exercised in jsdom.

## Docs updated

README now lists the route and a manual verification step.

## Open questions

None.
