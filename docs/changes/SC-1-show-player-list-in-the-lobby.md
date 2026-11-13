## Summary
Show live lobby player list and host

## What changed
- Store the creator's participant ID as host and expose it in room snapshots.
- List player names with a Host badge and poll the room while in the lobby; retain manual refresh and the last list on errors.
- Fix the default API URL so the client can reach the backend without configuration.

## Decisions
- The creator is the host; host-only permissions and game start behavior remain out of scope.
- Poll two seconds after the previous request completes, retry failures, and share an in-flight request with manual refresh. Room/session changes cannot be overwritten by an earlier response.

## How each criterion is met
- Names: `lists each player by name and marks only the creator as Host`; backend `preserves the creator as host and includes all names in snapshots after joins`.
- Host badge: `lists each player by name and marks only the creator as Host`; backend `preserves the creator as host and includes all names in snapshots after joins`.
- New joins: `polls for new players and stops polling after leaving the lobby`; backend `preserves the creator as host and includes all names in snapshots after joins`.

## How to verify
Start backend and frontend as described in README. Create a room, join it in another tab, and check both lobbies show both names and the creator's Host badge after a poll. Refresh Room also works manually.

## Tests
- Added lobby rendering, polling/cleanup, shared refresh, and failure/retry tests; added stale-room response and backend snapshot tests; updated API default URL assertion and create-room fixture.
- Frontend `npm test`: passed (12 tests); backend `npm test`: passed (5 tests). Earlier runs also passed (10 frontend, 5 backend tests).
- Both `npm run build` and `npx tsc --noEmit`: passed.
- HTTP create/join/fetch smoke test: passed.
- `npm run lint` in each app: unavailable (neither package defines a lint script). Root `npm test` was attempted twice but there is no root package.json; the app suites were run separately.
- Frontend tests emit existing React Router v7 future-flag warnings.

## Docs updated
README: lobby behavior, verification, and room snapshot host field.

## Open questions
None.
