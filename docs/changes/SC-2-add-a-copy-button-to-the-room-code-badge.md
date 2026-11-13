## Summary
Show numeric player count in lobby

## What changed
- Changed the lobby participant heading to show only the numeric count, e.g. `Participants (2)`.
- Added an accessible heading label with singular/plural player wording.
- Added a compact Copy button alongside the existing code in the shared lobby and game badge.
- Show Copied for two seconds after a successful clipboard write; report failures in the badge hint and retain the readable code.

## Decisions
- Keep the count derived from the latest room snapshot; the visible count is numeric-only as requested, while the accessible label says `1 player` for one participant.
- Use the browser Clipboard API and a native button. On rejection or unavailable API, offer manual copying rather than claiming success.
- Restart the feedback timer on repeated copies, clean it up on unmount or code change, and ignore stale requests. Keep styling scoped to the badge, including a fixed button width so its label change does not shift the row.

## How each criterion is met
- Count beside list: `lobby player count > shows the current count beside the participant list heading`.
- Join/leave refresh: `lobby player count > updates the count and list after players join and leave on refresh` uses mocked snapshots for both changes, including zero players.
- Singular: `lobby player count > uses the singular label for one player` checks the numeric visible heading and `1 player` accessible label.

Previous copy-button coverage:
- After creation, the badge shows Copy beside the code: `create room > shows the room code and Copy button in the lobby badge after creation` and `RoomCodeBadge > keeps the code readable next to a focusable, named native button`.
- Feedback lasts about two seconds: `RoomCodeBadge > copies the unchanged code and resets Copied two seconds after the latest click`.
- Keyboard access and name: `RoomCodeBadge > keeps the code readable next to a focusable, named native button` checks native button semantics, label and focusability. Native browser keyboard activation is relied upon.
- Code remains readable and unchanged: the two badge tests above check the displayed and copied values. The creation test checks placement in the existing lobby header. Styles are scoped to the badge; visual layout should also be checked in a browser, since jsdom does not perform layout.
- Failure and stale responses: `RoomCodeBadge > reports clipboard rejection or unavailability without claiming success` and `RoomCodeBadge > ignores an old copy result when the room code changes`.

## How to verify
Start the backend per README and start the frontend with `VITE_API_URL=http://localhost:3001 npm run dev` (the existing default has an extra `/bug` path). Create a room, join from another tab, and refresh the lobby to see the count change. The API has no leave endpoint; the leave case is covered by a mocked refresh test. Check the accessible heading label for `1 player` with a screen reader or browser accessibility inspector.

For the copy button, start both apps per README, create a room on localhost or HTTPS, use Tab and Enter/Space to activate Copy, paste the code, and check the feedback resets after two seconds. Check the badge and surrounding layout at desktop and mobile widths. Deny clipboard permission or use an unavailable clipboard to check the manual-copy hint.

## Tests
- Updated the three existing lobby count tests for numeric headings and accessible singular/plural labels; each targeted test passed individually and the full frontend suite passed (10 tests). React Router emitted future-flag warnings.
- Backend `npm test`: passed (4 tests).
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed; backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in each app: unavailable, neither package defines a lint script. Initial targeted test from the repository root failed because there is no root package.json; rerun from frontend passed.
- Existing copy-button work added four badge tests and one create-to-lobby integration test.
- Frontend `npm test`: passed twice, 7 tests; React Router emitted future-flag warnings.
- Backend `npm test`: passed twice, 4 tests.
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed (build run twice).
- Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed (build run twice).
- `npm run lint` in each app: unavailable, neither package defines a lint script.
- Root `npm test`: unavailable, no root package.json; app suites run separately above.
- `git diff --check`: passed. No browser visual or manual keyboard verification performed.

## Docs updated
- README: updated the lobby heading verification to reflect numeric visible and singular accessible labels.
- README also documents copying, verification, and clipboard requirements/failure.
- No agent instructions or API documentation changed; there is no API change.

## Open questions
None. Existing unrelated issue: the frontend default API URL includes `/bug`; use `VITE_API_URL` as above for manual verification.
