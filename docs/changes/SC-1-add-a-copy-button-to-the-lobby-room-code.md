## Summary
Show copy failures on the room code button

## What changed
- Reused the existing shared room code badge, which already provided the lobby Copy button and success feedback from SC-2.
- Show Copy failed on the button when clipboard access fails, keep the code selectable, and allow retrying. Widened the button to accommodate the label; the shared game badge behaves the same way.

## Decisions
- Retain the existing Clipboard API, two-second success timer, failure hint, and stale-request handling. Keep failure visible until a retry or room change so the player can copy manually.
- Explicitly permit text selection on the code; no clipboard fallback or API change was needed.

## How each criterion is met
- Copy beside the lobby code: `create room > shows the room code and Copy button in the lobby badge after creation`.
- Copies the room code: `RoomCodeBadge > copies the unchanged code and resets Copied two seconds after the latest click`.
- Copied for about two seconds then Copy: the same test checks the label at 1999 and 2000 ms after the latest click.
- Copy failed and selectable code: `RoomCodeBadge > shows Copy failed and keeps the code selectable after rejection or unavailability` covers both failure paths, selection and successful retry; `RoomCodeBadge > keeps a failure visible when a previous success timer would have expired` covers the timer interaction.

## How to verify
Start both apps as described in README, create a room on localhost or HTTPS, click Copy, paste and compare the code, and observe the label reset after two seconds. Deny clipboard permission or make the API unavailable, then check Copy failed, manually select and copy the code, and retry. Check the badge layout at desktop and mobile widths.

## Tests
- Updated the existing badge failure test for the button label and code selection, and added the previous-success-timer failure test.
- Frontend `npm test`: passed twice (7 tests before the additional test, 8 after); React Router emitted future-flag warnings.
- Backend `npm test`: passed (4 tests).
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed twice; backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in both apps: unavailable; neither package defines a lint script. Root `npm test` attempted twice: unavailable because there is no root package.json; both app suites were run separately.
- `git diff --check`: passed. Browser layout and manual clipboard verification were not performed; jsdom does not perform layout.

## Docs updated
- README troubleshooting now describes the button failure label and retry.
- No agent instructions or API documentation changed; no instructions or API behavior changed.

## Open questions
None.
