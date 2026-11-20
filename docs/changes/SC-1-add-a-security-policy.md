## Summary

Add a security reporting policy

## What changed

- Added root `SECURITY.md` directing vulnerability reports to a private GitHub security advisory rather than a public issue.
- Linked the policy from the README and clarified the vulnerability exception to the issue-first contribution guidance.

## Decisions

Linked directly to the advisory creation page for the repository identified by the Git remote. No response-time promises or other reporting channels were added.

## How each criterion is met

1. `backend/src/security.test.ts` — `exists at the repository root` verifies that `SECURITY.md` is a file at the root.
2. `backend/src/security.test.ts` — `directs vulnerability reports to a private GitHub security advisory, not public issues` checks the private reporting instructions, advisory link, and public-issue prohibition.

## How to verify

Read `SECURITY.md` and run `cd backend && npm test -- src/security.test.ts`. The advisory link points to the repository's GitHub advisory creation page; availability depends on GitHub repository settings.

## Tests

- Added two policy tests in `backend/src/security.test.ts`; the targeted run passed first with one test and then with both tests.
- Backend full suite: 13 tests passed. Frontend full suite: 14 tests passed, with React Router future-flag warnings.
- Both `npm run build` and `npx tsc -p tsconfig.json --noEmit` passed in each app.
- `npm run lint` in each app failed because neither package defines a lint script; no lint configuration is present.
- An initial root `npm test` attempt failed because there is no root package.json; the app-specific runs above passed.
- `git check-ignore` confirmed dependencies, build output, and TypeScript build info are ignored.

## Docs updated

Added `SECURITY.md`; updated `CONTRIBUTING.md` and `README.md` and added this note. No API or agent instruction changes were needed.

## Open questions

None.
