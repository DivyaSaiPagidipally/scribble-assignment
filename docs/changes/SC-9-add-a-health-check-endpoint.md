# Summary

Update the backend health check response

## What changed

- Changed the existing `GET /health` response from `{"ok":true}` to `{"status":"ok"}`.
- Added HTTP-level regression tests for status and JSON response.

## Decisions

- Reused the existing route and validated its response with Zod, consistent with backend guidelines. The existing status was already 200.

## How each criterion is met

1. HTTP 200: `GET /health > returns status 200` in `backend/src/health.test.ts`.
2. JSON `{"status":"ok"}`: `GET /health > returns the service status as JSON` in the same file checks the content type and exact body.

## How to verify

Run `cd backend && npm test -- src/health.test.ts`, or start the backend with `npm run dev` and request `http://localhost:3001/health`.

## Tests

- Added two HTTP integration tests. The status test passed on the existing route; the JSON test initially failed with `{"ok":true}`, then both passed after the change.
- Backend `npm test`: 15 passed; `npm run build` and `npx tsc -p tsconfig.json --noEmit`: passed.
- Frontend `npm test`: 14 passed with React Router future-flag warnings; `npm run build` and `npx tsc -p tsconfig.json --noEmit`: passed.
- `npm run lint` could not run in either package: neither defines a lint script. `git diff --check` passed.

## Docs updated

Updated `README.md` and `CONTRIBUTING.md` to describe the new response.

## Open questions

None.
