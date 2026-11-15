# Summary

Show the drawer's word on the Game screen

## What changed

The Game screen displays a word card for the drawer. Room snapshots include `currentWord` only for the drawer and no longer include `availableWords`.

## Decisions

The first entry in the existing shared starter list is the deterministic room word. The scaffold has no synchronized start or round state, so the word is available to the drawer from room creation. This is UI/API visibility, not a security boundary: participant IDs are public and the deterministic list is in the source; authentication is out of scope.

## How each criterion is met

1. Drawer card: `game word card > shows the current word in a card to the drawer` and `room API roles > returns the current word to the drawer on create and refresh`.
2. Guessers do not see it: `game word card > hides the word from guessers and unknown viewers even if supplied in a snapshot` and `room API roles > omits the word and word list from guesser, anonymous and unknown viewer responses`.
3. Room word list: `roomStore > selects the first room-list word consistently for the drawer`.

## How to verify

Run backend and frontend with the README instructions. Create a room in one tab, join in another, and open Game in each: only the creator's card displays the word.

## Tests

- Added Game page rendering tests for drawer, guesser, unknown viewer, and missing word; targeted frontend run: 3 passed.
- Added API tests for drawer create/refresh and guesser/anonymous/unknown responses; targeted backend run: 4 passed.
- Added room store selection and stability test; targeted backend run: 5 passed.
- Full `npm test`: backend 12 passed; frontend 14 passed (React Router future-flag warnings only).
- `npx tsc --noEmit -p tsconfig.json` and `npm run build`: both apps passed. The first backend typecheck failed on a test mutation outside the literal word union; fixed the test and reran successfully.
- `npm run lint --if-present`: completed in both apps; neither defines a lint script.

## Docs updated

README describes the word, snapshot contract, verification, and visibility limitations. Existing `.gitignore` already excludes dependencies and build output.

## Open questions

None for this scope. Real secrecy and synchronized round lifecycle remain outside this change.
