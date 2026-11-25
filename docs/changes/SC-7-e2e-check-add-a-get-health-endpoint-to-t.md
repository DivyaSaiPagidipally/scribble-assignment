# Summary

Update the health endpoint response

## What changed

- Changed the existing `GET /health` response to `{ "status": "ok" }`.
- Added an HTTP-level test for the response.

## Decisions

- Reused the existing endpoint and validated its fixed response with Zod.

## How each criterion is met

- `GET /health` returns 200 with `{ "status": "ok" }`: covered by `health API > returns an ok status` in `backend/src/app.test.ts`.

## How to verify

- Run `cd backend && npm test -- src/app.test.ts`, or start the backend and request `http://localhost:3001/health`.

## Tests

- Added one health endpoint test; focused backend run passed (1 test).
- `cd backend && npm test`: passed (14 tests).
- `cd frontend && npm test`: passed (14 tests; React Router future-flag warnings).
- `cd backend && npm run build` and `cd frontend && npm run build`: passed, including TypeScript checks.
- An initial `npm test` from the repository root failed because there is no root package.json; the app-specific suites above passed.
- No code lint script or configuration is provided; `git diff --check` passed. The existing PR-description lint is not a code lint.

## Docs updated

- Updated `README.md` and `CONTRIBUTING.md` to describe the new health response.

## Open questions

- None.
