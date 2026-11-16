## Summary

Disable Start Game until two players join

## What changed

- The lobby disables Start Game below two participants and displays an associated hint beneath it.
- The button and hint update from the latest room snapshot after manual refresh.

## Decisions

- Count participants in the existing room snapshot; zero players also disables the button.
- Preserve the existing navigation to the placeholder Game screen. This is a client-side control, not server-side game start or host authorization; automatic polling is not implemented.

## How each criterion is met

1. One player: `disables Start Game with fewer than two players` checks the disabled button (also at zero).
2. Hint: `shows the minimum-player hint under Start Game when needed` checks its text, position and accessible association.
3. Two or more: `enables Start Game for two or more players` checks two and three players. `updates the start button and hint when the room is refreshed` checks both transitions.

## How to verify

Start backend and frontend as described in README. Create a room, observe the disabled button and hint, join in another tab, then refresh the lobby and observe the enabled button. The Game screen remains a placeholder.

## Tests

- Added the four lobby start button tests named above.
- Focused criterion 1 test: passed (1 test).
- Focused criterion 2 test: passed (1 test).
- Focused lobby start button tests: passed (4 tests).
- `cd frontend && npm test`: passed (15 tests); React Router emitted future-flag warnings.
- `cd backend && npm test`: passed (9 tests).
- `npx tsc --noEmit` and `npm run build` in each package: passed.
- `npm run` in each package confirms no code lint script is configured; lint could not be run. `git diff --check` passed.

## Docs updated

- README: current lobby behavior and manual verification, including the placeholder and client-side limitations.
- No API or agent instructions changed.

## Open questions

None.
