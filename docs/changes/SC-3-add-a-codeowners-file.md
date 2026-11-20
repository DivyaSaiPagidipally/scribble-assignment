## Summary

Add a repository-wide code owner

## What changed

- Added `.github/CODEOWNERS` with a catch-all owner rule.
- Added a regression test and documented the owner in the contributing guide.

## Decisions

Use one `*` rule with no overrides so it applies to all paths, including the CODEOWNERS file itself.

## How each criterion is met

1. `.github/CODEOWNERS` assigns every file to `@DivyaSaiPagidipally`; `backend/src/codeowners.test.ts` checks the catch-all rule and absence of overrides.

## How to verify

Run `cd backend && npm test -- src/codeowners.test.ts` and inspect `.github/CODEOWNERS`.

## Tests

- Added `backend/src/codeowners.test.ts`: targeted run passed (1 test). An initial run from the root failed because there is no root package.json; the backend run passed.
- Full `npm test`: backend 11 passed; frontend 14 passed with React Router future-flag warnings.
- `npm run build` and `npx tsc -p tsconfig.json --noEmit` passed in both apps.
- `npm run lint` failed in both apps because neither defines a lint script; no general lint configuration was found.
- `git check-ignore` confirmed dependencies, build output, Vite cache and TypeScript build info are ignored.

## Docs updated

Updated `CONTRIBUTING.md` and this change note. No API or agent instructions changed.

## Open questions

None.
