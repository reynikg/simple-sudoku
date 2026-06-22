# TODO

Ideas and improvements for future versions. This is a hobby project, so no timelines — just a wish list.

## Gameplay

- [ ] Guarantee a unique solution for each generated puzzle (current generator can produce multiple solutions).
- [ ] Add difficulty levels (easy / medium / hard) by varying how many cells are removed.
- [ ] Add a hint button that reveals a single correct cell.
- [ ] Add an undo / redo stack.
- [ ] Auto-remove pencil notes that conflict with a newly placed number.
- [ ] Add a pause button that hides the board and freezes the timer.

## UI / UX

- [ ] Add a mouse / touch number pad for tablets and phones.
- [ ] Add a dark mode toggle.
- [ ] Add a subtle win animation or confetti on a correct solve.
- [ ] Make notes mode state more visible (e.g. a dedicated indicator).
- [ ] Improve focus styling for accessibility.

## Technical

- [ ] Persist the in-progress game so a refresh does not lose it.
- [ ] Add a reset option for the stored best time.
- [ ] Add basic unit tests for the validation and generation logic.
- [ ] Consider a small build step only if the project grows.

## Known Issues

- Generated puzzles are not guaranteed to have a single unique solution.
- Best time is stored per-browser via `localStorage` and is not shared across devices.
