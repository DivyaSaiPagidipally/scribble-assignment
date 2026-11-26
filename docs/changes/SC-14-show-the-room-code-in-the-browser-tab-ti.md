# Summary

Show the room code in the tab title

## What changed

Lobby and Game set the tab title from the current room snapshot and restore the default when leaving.

## Decisions

A shared page hook tracks room code changes and resets the title on unmount. The existing HTML title remains the default for other pages; room state retained after navigation does not affect their title.

## How each criterion is met

- Lobby and Game: `shows the current room code in the lobby and game, including after a room update` checks both screens, room updates and navigation between them.
- Start, Create Room and Join Room: `uses the default title on start, create and join pages, including after leaving either room page` checks direct entry and navigation from both room screens while room state remains populated.

## How to verify

Start both apps as described in README. Create or join a room and check the tab title in Lobby and Game, then navigate to the other screens and check that it returns to Scribble.

## Tests

- Added `frontend/src/pages/RoomTitle.test.tsx`. The focused test initially failed because the room title was absent; after implementation it passed. With the second criterion added, both tests passed.
- Frontend `npm test`: 16 passed. Backend `npm test`: 13 passed. React Router emitted its existing v7 future-flag warnings.
- Both `npm run build` commands and `npx tsc --noEmit -p tsconfig.json` passed.
- `npm run lint` could not run in either app: neither defines a lint script. An accidental root `npm test` also failed because there is no root package.json; the app-specific suites above passed.
- Browser runtime verification was unavailable in this environment.

## Docs updated

README documents the title and a manual verification step. No API or instruction changes were needed.

## Open questions

None.
