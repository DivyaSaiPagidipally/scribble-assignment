## Summary
Describe the Scribble starter in the README

## What changed
- Added a short, standalone README description of the Scribble starter in the earlier rework; retained it here.
- Added a compact Copy button alongside the existing code in the shared lobby and game badge.
- Show Copied for two seconds after a successful clipboard write; report failures in the badge hint and retain the readable code.

## Decisions
- Describe the app as a starter, matching its current incomplete scope. Retain the existing README tests and earlier copy-button work.
- Use the browser Clipboard API and a native button. On rejection or unavailable API, offer manual copying rather than claiming success.
- Restart the feedback timer on repeated copies, clean it up on unmount or code change, and ignore stale requests. Keep styling scoped to the badge, including a fixed button width so its label change does not shift the row.

## How each criterion is met
- Short app description: `README > describes the app` checks the line in `README.md`.
- Standalone paragraph: `README > puts the app description in its own paragraph` checks the paragraph boundaries.
- Earlier copy-button criteria: after creation, the badge shows Copy beside the code: `create room > shows the room code and Copy button in the lobby badge after creation` and `RoomCodeBadge > keeps the code readable next to a focusable, named native button`.
- Feedback lasts about two seconds: `RoomCodeBadge > copies the unchanged code and resets Copied two seconds after the latest click`.
- Keyboard access and name: `RoomCodeBadge > keeps the code readable next to a focusable, named native button` checks native button semantics, label and focusability. Native browser keyboard activation is relied upon.
- Code remains readable and unchanged: the two badge tests above check the displayed and copied values. The creation test checks placement in the existing lobby header. Styles are scoped to the badge; visual layout should also be checked in a browser, since jsdom does not perform layout.
- Failure and stale responses: `RoomCodeBadge > reports clipboard rejection or unavailability without claiming success` and `RoomCodeBadge > ignores an old copy result when the room code changes`.

## How to verify
Read the opening paragraph of `README.md` or run `cd backend && npm test -- src/readme.test.ts`.

For the earlier copy-button work, start both apps per README, create a room on localhost or HTTPS, use Tab and Enter/Space to activate Copy, paste the code, and check the feedback resets after two seconds. Check the badge and surrounding layout at desktop and mobile widths. Deny clipboard permission or use an unavailable clipboard to check the manual-copy hint.

## Tests
- Earlier rework added two README tests; both targeted runs passed individually (one test passed, one skipped each).
- Current full backend `npm test`: 6 passed; frontend `npm test`: 7 passed, with React Router future-flag warnings.
- Current backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed. Frontend `npx tsc -b --pretty false` and `npm run build`: passed.
- Current `npm run lint` in both apps: unavailable, neither package defines a lint script. An initial root `npm test` targeted run failed because there is no root package.json; the backend targeted runs succeeded.
- Earlier copy-button work added four badge tests and one create-to-lobby integration test.
- Frontend `npm test`: passed twice, 7 tests; React Router emitted future-flag warnings.
- Backend `npm test`: passed twice, 4 tests.
- Frontend `npx tsc -b --pretty false` and `npm run build`: passed (build run twice).
- Backend `npx tsc -p tsconfig.json --noEmit` and `npm run build`: passed (build run twice).
- `npm run lint` in each app: unavailable, neither package defines a lint script.
- Root `npm test`: unavailable, no root package.json; app suites run separately above.
- `git diff --check`: passed. No browser visual or manual keyboard verification performed.

## Docs updated
- README: added the standalone app description in the earlier rework; documented copying, verification, and clipboard requirements/failure in the earlier copy-button work.
- This change note: recorded the rework criteria and verification.
- No agent instructions or API documentation changed; there is no API change.

## Open questions
None.
