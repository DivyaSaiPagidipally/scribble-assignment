## Summary

Add a local contributing guide

## What changed

- Added root `CONTRIBUTING.md` with prerequisites, install and dev commands, local URLs, and the required frontend API override.
- Linked the guide from `README.md` and added a guide command test.

## Decisions

Kept the guide short and aligned with the README and package scripts. The frontend command sets `VITE_API_URL` explicitly because the starter default includes `/bug`.

## How each criterion is met

1. The root guide lists install and start commands for both apps; `backend/src/contributing.test.ts` checks both command blocks.

## How to verify

Follow `CONTRIBUTING.md` from the repository root in separate terminals, then visit the frontend and backend health URLs. Run `cd backend && npm test -- src/contributing.test.ts` to check the documented commands.

## Tests

- Added `backend/src/contributing.test.ts`; its targeted run passed (1 test). An initial attempt from the repository root failed because there is no root package.json; rerunning from `backend` passed.
- `npm test` in `backend`: 10 passed. `npm test` in `frontend`: 14 passed, with React Router future-flag warnings.
- `npm run build` and `npx tsc -p tsconfig.json --noEmit` in each app: passed.
- No lint script or lint configuration is provided in either package, so lint could not be run.
- `npm install` in each app succeeded; npm reported 12 backend and 14 frontend dependency vulnerabilities and install-script warnings. Lockfile changes made by npm were discarded.
- Started both documented dev commands: backend `/health` returned `{"ok":true}`, frontend returned HTTP 200, and the served API module contained the local API URL.
- Existing `.gitignore` excludes dependencies, build outputs, and TypeScript build info.

## Docs updated

`CONTRIBUTING.md`, `README.md`, and this change note. No API or agent instruction changes were needed.

## Open questions

None.
