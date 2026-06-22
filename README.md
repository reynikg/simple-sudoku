# Simple Sudoku

A clean, lightweight Sudoku game built with plain JavaScript, HTML and CSS. No frameworks, no build step — just open it in a browser and play.

This is a hobby project made for fun.

**Current version:** v.1.9-stable (04/06/2026)

## Features

- Random puzzle generation on every new game
- Pencil notes mode (toggle with the **Shift** key)
- Crosshair highlighting for the active row and column
- Matching-number highlighting across the board
- Live duplicate detection with the **Check Solution** button
- Stopwatch timer with centisecond precision
- Best-time tracking saved locally in your browser
- Number tracker that dims a digit once all nine are placed
- Keyboard navigation with the arrow keys
- Responsive layout for smaller screens

## How to Play

1. Open `index.html` in any modern web browser.
2. Click a cell (or navigate with the arrow keys) and type a number from 1–9.
3. Press **Shift** to toggle notes mode, then type digits to add or remove pencil marks.
4. Use **Backspace** or **Delete** to clear a cell.
5. Click **Check Solution** to validate the board, **Reset Puzzle** to clear your entries, or **New Game** for a fresh puzzle.

## Controls

| Action | Input |
| --- | --- |
| Enter a number | Keys `1`–`9` |
| Toggle notes mode | `Shift` |
| Clear a cell | `Backspace` / `Delete` |
| Move between cells | Arrow keys |

## Project Structure

```
simple-sudoku/
├── index.html      # Page markup and layout
├── styles.css      # All styling
├── game.js         # Game logic
├── README.md       # This file
├── TODO.md         # Planned improvements
├── CHANGELOG.md    # Version history
├── LICENSE         # MIT License
└── sudoku9.html    # Original single-file version (archived)
```

## Running Locally

No dependencies or build tools are required. Either:

- Double-click `index.html` to open it directly, or
- Serve the folder with a simple static server, for example:

  ```bash
  python3 -m http.server 8000
  ```

  then visit `http://localhost:8000`.

## Notes

The puzzle generator builds a valid solved grid by shuffling a base pattern, then removes 45 cells. Because it does not currently guarantee a unique solution, some puzzles may have more than one valid answer (see [TODO.md](TODO.md)).

## License

Released under the [MIT License](LICENSE).
