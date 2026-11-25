## Summary

Add a root changelog

## What changed

- Added `CHANGELOG.md` with a Keep a Changelog reference and an empty Unreleased section.
- Linked the changelog from `README.md` and added checks for its location and heading.

## Decisions

Left release history and entries empty rather than inventing changes.

## How each criterion is met

1. `CHANGELOG.md` exists at the repository root; `backend/src/changelog.test.ts` checks that it is a file.
2. It has an Unreleased section; `backend/src/changelog.test.ts` checks the Markdown heading.

## How to verify

Run `cd backend && npm test -- src/changelog.test.ts`, or inspect `CHANGELOG.md` at the repository root.

## Tests

- Added `backend/src/changelog.test.ts`: focused run passed (2 tests). The root file and heading were also checked separately with `test -f` and `grep`.
- `cd backend && npm test`: 13 passed initially; 15 passed after adding the checks. `npm run build` passed both times (including TypeScript checking).
- `cd frontend && npm test`: 14 passed, with React Router future-flag warnings. `npm run build` passed, including TypeScript checking.
- An initial `npm test` from the root failed because there is no root `package.json`; the package-specific commands above passed.
- Neither package provides a lint script or lint configuration. The existing `.gitignore` excludes dependencies and build outputs, verified with `git check-ignore`.

## Docs updated

`CHANGELOG.md`, `README.md`, and this change note. No API or agent instruction changes were needed.

## Open questions

None.
