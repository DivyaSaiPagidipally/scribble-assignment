## Summary

Add a footer note to the README

## What changed

Appended `Built and checked by Factory.` to `README.md`.

## Decisions

Kept the README change to the single requested line. No automated test file was added for static copy.

## How each criterion is met

1. The README ends with the requested line; the `tail` footer check below passed.

## How to verify

Run `test "$(tail -n 1 README.md)" = 'Built and checked by Factory.'` from the repository root.

## Tests

- Footer check and `git diff --check`: passed.
- `cd backend && npm test && npm run build`: passed (13 tests; TypeScript build passed).
- `cd frontend && npm test && npm run build`: passed (14 tests; TypeScript/Vite build passed); React Router emitted future-flag warnings.
- An initial `npm test` at the root failed because there is no root `package.json`; the package suites above were run from their own directories.
- Neither package provides a lint script or lint configuration.

## Docs updated

`README.md` and this change note. No other documentation needed updating.

## Open questions

None.
