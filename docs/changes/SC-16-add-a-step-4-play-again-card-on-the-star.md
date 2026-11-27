# Summary

Add a Play again card to the Start page

## What changed

Added a fourth card after Win using the existing Card component and the requested copy.

## Decisions

The card is presentational only; the starter does not implement a restart flow. Existing card styling and responsive grid are reused.

## How each criterion is met

1. `shows Play again as Step 4 after Win` checks card count, order, title and badge.
2. `explains that players can start another round with the same friends` checks the exact text.
3. `preserves the Draw, Guess and Win cards` checks the original badges, titles and text in order.

All three tests are in `frontend/src/pages/StartPage.test.tsx`.

## How to verify

Run `cd frontend && npm test -- src/pages/StartPage.test.tsx`, or start the frontend as described in README and inspect the Start page. The copy is presentational, not a working restart feature.

## Tests

- Focused test initially failed with three cards; passed after adding Step 4 (1 test).
- Text test initially failed with no paragraph; both focused tests passed after adding the copy.
- Focused regression suite passed (3 tests), including the unchanged original cards.
- `cd frontend && npm test`: 17 passed; React Router emitted existing future-flag warnings.
- `cd backend && npm test`: 13 passed.
- `npm run build` in both frontend and backend passed, including TypeScript checks.
- No project code-lint script or configuration exists; `git diff --check` passed.
- Browser verification was unavailable in this environment.

## Docs updated

Updated the README quick verification steps to mention the four presentational cards. No API or agent instructions changed.

## Open questions

None.
