## Summary
Show lobby player cards and count

## What changed
- Reused the existing participant list and card styling for named player cards; added a count after the list or empty state.
- Manual refresh continues to replace the displayed snapshot; failed refreshes retain the last list and show an error.

## Decisions
- The human clarified that roles are not required and requested a player count after the players. No drawer or guesser is invented or displayed; the snapshot only lists available roles, not assignments.
- Keep manual refresh rather than adding polling or changing the API.
- No SC-1 change note existed in the checked-out branch, so this note was created; the existing lobby list and styles were retained and extended.

## How each criterion is met
- Each joined player has a named card: `lobby participants > shows every player as a named card followed by the player count`.
- Role on each card: superseded by the human clarification; the same test checks names and count instead.
- The list and count update on refresh: `lobby participants > updates cards, count and empty state from refreshed snapshots`.
- No players: `lobby participants > shows an empty state and zero count when no one has joined`.
- Refresh failure: `lobby participants > keeps the last list and reports a refresh failure`.

## How to verify
Start the backend and frontend as in README, setting `VITE_API_URL=http://localhost:3001` for the frontend. Create a room, join it in another tab, and refresh the first lobby. Check both names and the count after the cards. An empty snapshot shows the empty message and zero count. No visual browser check was performed.

## Tests
- Added four LobbyPage tests covering cards, count, empty state, refresh and refresh failure.
- Frontend `npm test`: passed, 11 tests; React Router emitted future-flag warnings. `npx tsc -b --pretty false` and `npm run build`: passed.
- Backend `npm test`: passed, 4 tests. `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in both apps: unavailable, no lint script defined. Root `npm test` and `npm run lint`: unavailable, no root package.json.
- `git diff --check`: passed.

## Docs updated
- README describes the cards, count, refresh and absence of lobby roles. No API or agent instruction changes were needed.

## Open questions
- None for this ticket. The pre-existing frontend default API URL ends in `/bug`; use `VITE_API_URL` as above for manual verification.
