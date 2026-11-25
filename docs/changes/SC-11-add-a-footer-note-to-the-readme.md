## Summary

Add a footer note to the README

## What changed

Added a blank line before the existing `Built and checked by Factory.` footer in `README.md`.

## Decisions

Kept the footer text exactly as requested and separated it from the preceding content per review. No automated test file was added for static copy.

## How each criterion is met

1. The README ends with the requested line; the footer check below also verifies the preceding blank line.

## How to verify

From the repository root, run:

```bash
node -e "const fs = require('fs'); const data = fs.readFileSync('README.md', 'utf8'); if (!data.endsWith('\n\nBuilt and checked by Factory.\n')) process.exit(1); console.log('Footer check passed');"
```

## Tests

- No test file added for this static documentation change; the footer check and `git diff --check` passed.
- `cd backend && npm test && npm run build`: passed (13 tests; TypeScript build passed).
- `cd frontend && npm test && npm run build`: passed (14 tests; TypeScript/Vite build passed); React Router emitted future-flag warnings.
- `npm test` at the root failed because there is no root `package.json`; the package suites above passed from their own directories.
- Neither package provides a code lint script or configuration; the existing PR-description lint is unrelated.

## Docs updated

`README.md` and this change note. No other documentation needed updating.

## Open questions

None.
