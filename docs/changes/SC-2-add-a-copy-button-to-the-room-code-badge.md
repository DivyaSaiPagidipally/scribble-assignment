## Summary
Add Hello to the Start page

## What changed
- Added Hello as text at the top of the Start page, preserving the existing Scribble@2026 footer.
- Previously changed the Start page footer from Hello to Scribble@2026, as requested in review.
- Earlier work added a compact Copy button alongside the existing code in the shared lobby and game badge.
- Show Copied for two seconds after a successful clipboard write; report failures in the badge hint and retain the readable code.

## Decisions
- Put Hello in the Start page content as clarified by the human, without changing the previously reviewed Scribble@2026 footer.
- Use the browser Clipboard API and a native button. On rejection or unavailable API, offer manual copying rather than claiming success.
- Restart the feedback timer on repeated copies, clean it up on unmount or code change, and ignore stale requests. Keep styling scoped to the badge, including a fixed button width so its label change does not shift the row.

## How each criterion is met
- Add Hello: `StartPage > shows Hello as text on the main page` checks the greeting in the Start page content. The existing `StartPage > shows Scribble@2026 in the footer after the main page content` test preserves the reviewed footer.

Earlier copy-button criteria and coverage:
- After creation, the badge shows Copy beside the code: `create room > shows the room code and Copy button in the lobby badge after creation` and `RoomCodeBadge > keeps the code readable next to a focusable, named native button`.
- Feedback lasts about two seconds: `RoomCodeBadge > copies the unchanged code and resets Copied two seconds after the latest click`.
- Keyboard access and name: `RoomCodeBadge > keeps the code readable next to a focusable, named native button` checks native button semantics, label and focusability. Native browser keyboard activation is relied upon.
- Code remains readable and unchanged: the two badge tests above check the displayed and copied values. The creation test checks placement in the existing lobby header. Styles are scoped to the badge; visual layout should also be checked in a browser, since jsdom does not perform layout.
- Failure and stale responses: `RoomCodeBadge > reports clipboard rejection or unavailability without claiming success` and `RoomCodeBadge > ignores an old copy result when the room code changes`.

## How to verify
Open the Start page and confirm Hello appears above the main content and Scribble@2026 appears in the footer.

For the earlier copy-button work, start both apps per README, create a room on localhost or HTTPS, use Tab and Enter/Space to activate Copy, paste the code, and check the feedback resets after two seconds. Check the badge and surrounding layout at desktop and mobile widths. Deny clipboard permission or use an unavailable clipboard to check the manual-copy hint.

## Tests
- Added `StartPage > shows Hello as text on the main page`; `cd frontend && npm test -- src/pages/StartPage.test.tsx` passed (2 tests).
- Frontend `npm test`: passed (16 tests, React Router future-flag warnings); backend `npm test`: passed (13 tests).
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed. Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in both apps: unavailable because neither package defines a lint script. No browser visual verification performed.

Previous footer update:
- Updated `StartPage.test.tsx` for the reviewed text; `cd frontend && npm test -- src/pages/StartPage.test.tsx` passed (1 test). The initial attempt from the repository root failed because there is no root package.json.
- Current frontend `npm test`: passed, 12 tests (React Router future-flag warnings); backend `npm test`: passed, 9 tests.
- Current frontend `npx tsc -b --pretty false` and `npm run build`: passed. Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- Current `npm run lint` in both apps: unavailable, neither package defines a lint script.
- `git diff --check`: passed. No browser visual verification performed.

Previous Hello-footer work:
- Added `StartPage.test.tsx`; targeted frontend test passed (1 test). The initial attempt from the repository root failed because there is no root package.json; rerunning in frontend passed.
- Frontend `npm test`: passed, 12 tests; React Router emitted future-flag warnings. Backend `npm test`: passed, 9 tests.
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed. Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed.
- `npm run lint` in both apps: unavailable, neither package defines a lint script.
- `git diff --check`: passed. No browser visual verification performed.

Earlier copy-button work:
- Added four badge tests and one create-to-lobby integration test.
- Frontend `npm test`: passed twice, 7 tests; React Router emitted future-flag warnings.
- Backend `npm test`: passed twice, 4 tests.
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed (build run twice).
- Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed (build run twice).
- `npm run lint` in each app: unavailable, neither package defines a lint script.
- Root `npm test`: unavailable, no root package.json; app suites run separately above.
- `git diff --check`: passed. No browser visual or manual keyboard verification performed.

## Docs updated
- README: documented Hello on the Start page and its verification; previously documented the footer, copying, verification, and clipboard requirements/failure.
- No agent instructions or API documentation changed; there is no API change.

## Open questions
None.
