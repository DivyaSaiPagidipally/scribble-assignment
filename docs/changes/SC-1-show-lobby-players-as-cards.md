## Summary
Show lobby player roles on cards

## What changed
- Retained the existing player cards, count, empty state and manual refresh; added each player's role to their card.
- The backend stores roles on participants, validates room responses and includes roles in create, join and fetch snapshots. Failed refreshes retain the last list and show an error.

## Decisions
- Per the human clarification, the creator is the drawer and all later joiners are guessers. Roles cannot be selected and are not reassigned; drawer departure is out of scope.
- Keep the existing manual refresh rather than adding polling. The existing count and empty state are retained.

## How each criterion is met
- Each joined player appears as a card: `lobby participants > shows every player as a card with their name and role followed by the player count`.
- Cards show names and roles: the same test checks both; `roomStore > assigns the creator as drawer and every subsequent joiner as guesser in snapshots` and `room API roles > includes assigned roles in create, join and refreshed snapshots` cover server assignment and delivery.
- Refresh updates the list: `lobby participants > updates cards, count and empty state from refreshed snapshots`.
- Empty snapshot: `lobby participants > shows an empty state and zero count when no one has joined`.

## How to verify
Start the backend and frontend as in README, setting `VITE_API_URL=http://localhost:3001` for the frontend. Create a room, join it in another tab, and refresh the first lobby. Check both names, drawer/guesser roles and count. An empty snapshot shows the empty message and zero count. No visual browser check was performed.

## Tests
- Updated LobbyPage tests for roles and refresh; added backend store, HTTP API and response validation tests, including invalid roles, server error on invalid output and joining an empty saved room. Existing empty-state and refresh-failure tests remain.
- Focused frontend card, refresh and empty-state tests passed (1, 2 and 2 tests respectively); focused backend store/API/schema tests passed (8 tests). An initial frontend test command run at the repository root failed because there is no root package.json; rerunning in frontend passed.
- Frontend `npm test`: passed, 11 tests; React Router emitted future-flag warnings. `npx tsc -b --pretty false` and `npm run build`: passed.
- Backend `npm test`: passed, initially 8 and then 9 tests after adding the invalid-response HTTP test. `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in both apps: unavailable, no lint script defined. `git diff --check`: passed.

## Docs updated
- README documents role assignment, snapshot fields, manual refresh and local API configuration. No separate API docs or agent instruction changes were needed.

## Open questions
- None for this ticket. The pre-existing frontend default API URL ends in `/bug`; use `VITE_API_URL` as above for manual verification.
