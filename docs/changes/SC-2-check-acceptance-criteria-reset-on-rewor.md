## Summary

Describe the Scribble starter in the README.

## What changed

Added a short app description and README regression tests.

## Decisions

The description calls Scribble a starter to avoid implying that the unfinished game features are implemented.

## How each criterion is met

1. The README describes the app: `README > describes the app`.
2. The description is a separate paragraph: `README > puts the app description in its own paragraph`.

## How to verify

Read the opening of `README.md` and run `cd backend && npm test -- src/readme.test.ts`.

## Tests

- Added `backend/src/readme.test.ts` with the two tests named above; the focused run passed first with one test and then with both tests.
- Backend `npm test`: 6 passed; frontend `npm test`: 7 passed (React Router future-flag warnings).
- Both `npm run build` commands and both `npx tsc --noEmit -p tsconfig.json` commands passed.
- `npm run lint --if-present` completed in both packages; neither defines a lint script. `git diff --check` passed.
- An initial root-level `npm test` failed because there is no root `package.json`; the package suites were run successfully instead.

## Docs updated

Updated `README.md`; no API or instruction changes were needed.

## Open questions

None.
