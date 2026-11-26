## Summary

Add three starter words

## What changed

Added balloon, dragon and umbrella after the existing five starter words.

## Decisions

Kept the existing word order and used the existing seed list without changing word selection or game behavior.

## How each criterion is met

1. The starter list contains the requested eight words: `backend/src/seed/starterData.test.ts` — `starter data > contains the full starter word list` checks the exact list and order.
2. The same backend test checks the complete starter word list.

## How to verify

Run `cd backend && npm test -- src/seed/starterData.test.ts`.

## Tests

- Added the full-list backend test. Its initial focused run failed with the three new words missing; after the change, the focused run passed (1 test).
- Backend full suite: 14 tests passed. Frontend full suite: 14 tests passed, with React Router future-flag warnings.
- Backend and frontend `npm run build` and `npx tsc -p tsconfig.json --noEmit` passed.
- `npm run lint` in both apps failed because neither defines a lint script or has a lint configuration.
- A root `npm test` attempt failed because there is no root package.json; the app-specific suites passed as above.
- `git check-ignore` confirmed dependencies, build output and TypeScript build info are ignored; `git diff --check` passed.

## Docs updated

Updated the starter word list in `README.md` and added this change note. Agent instructions and API documentation did not need changes.

## Open questions

None.
