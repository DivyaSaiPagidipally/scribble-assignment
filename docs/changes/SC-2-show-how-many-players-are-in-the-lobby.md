## Summary

Show the lobby player count

## What changed

The Participants heading shows the number of players in the displayed room snapshot.

## Decisions

Derive the count from the same participant array as the list, without separate state or an API change. Refresh remains manual; the starter has no leave endpoint or automatic polling.

## How each criterion is met

1. The heading beside the list displays the count: `shows the current count beside the participant list heading`.
2. A refreshed snapshot updates both list and count for joins and departures: `updates the count and list after players join and leave on refresh`.
3. One participant uses the singular: `uses the singular label for one player`.

All tests are in `frontend/src/pages/LobbyPage.test.tsx`. Departures are represented by mocked snapshots because the current API has no leave operation.

## How to verify

Start the backend and frontend as described in the README. Create a room and check `1 player` in the Participants heading; join from another tab and select Refresh Room in the first tab to see `2 players`. Run `cd frontend && npm test -- src/pages/LobbyPage.test.tsx` to verify refresh with departures and the empty list.

## Tests

- Added three lobby component tests covering the heading, refresh after joining and leaving, empty list, and singular label.
- Targeted frontend test ran after each criterion: 1, 2, then 3 tests passed.
- `cd frontend && npm test`: 10 passed; `npm run build` and `npx tsc --noEmit -p tsconfig.json` passed.
- `cd backend && npm test`: 4 passed; `npm run build` and `npx tsc --noEmit -p tsconfig.json` passed.
- Both `npm run lint` commands failed because neither package defines a lint script. No lint configuration is provided.
- An initial `npm test` at the repository root failed because there is no root package.json; both package suites passed as above. Frontend tests emit React Router v7 future-flag warnings.

## Docs updated

README now describes the count and includes it in quick verification. No API or agent instructions changed.

## Open questions

None.
