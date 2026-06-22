/* ==========================================================================
   Simple Sudoku — game.js
   Core game logic: puzzle generation, rendering, input handling,
   validation, timer, best-time tracking and the number tracker.
   ========================================================================== */

const boardElement = document.getElementById('sudoku-board');
const trackerElement = document.getElementById('number-tracker');
const messageElement = document.getElementById('message');
const timerElement = document.getElementById('timer');
const bestTimeElement = document.getElementById('best-time');

let cells = [];
let activePuzzle = [];
let timerInterval;
let startTime;
let elapsedMs = 0;

let isNotesMode = false;

// Toggle notes mode with the Shift key.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        isNotesMode = !isNotesMode;
        if (isNotesMode) {
            trackerElement.classList.add('notes-mode');
        } else {
            trackerElement.classList.remove('notes-mode');
        }
    }
});

function generateRandomPuzzle() {
    const base = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    const newBoard = base.map(row => row.map(val => nums[val - 1]));

    let removed = 0;
    while (removed < 45) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (newBoard[r][c] !== 0) {
            newBoard[r][c] = 0;
            removed++;
        }
    }
    return newBoard;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${centiseconds}`;
}

function loadBestTime() {
    const storedBest = localStorage.getItem('sudokuBestTime');
    if (storedBest) {
        bestTimeElement.innerText = formatTime(parseInt(storedBest, 10));
    } else {
        bestTimeElement.innerText = "--:--.--";
    }
}

function handleWinRecord(finalTimeMs) {
    const storedBest = localStorage.getItem('sudokuBestTime');
    if (!storedBest || finalTimeMs < parseInt(storedBest, 10)) {
        localStorage.setItem('sudokuBestTime', finalTimeMs);
        loadBestTime();
        return true;
    }
    return false;
}

function startTimer() {
    clearInterval(timerInterval);
    timerElement.classList.remove('stopped');
    startTime = Date.now();

    timerInterval = setInterval(() => {
        elapsedMs = Date.now() - startTime;
        timerElement.innerText = formatTime(elapsedMs);
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerElement.classList.add('stopped');
}

function createTracker() {
    trackerElement.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const numDiv = document.createElement('div');
        numDiv.className = 'tracker-num';
        numDiv.id = `tracker-${i}`;
        numDiv.innerText = i;
        trackerElement.appendChild(numDiv);
    }
}

function updateNumberTracker() {
    const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0};

    cells.forEach(row => {
        row.forEach(cell => {
            const val = cell.dataset.value;
            if (val && val >= 1 && val <= 9) {
                counts[val]++;
            }
        });
    });

    for (let i = 1; i <= 9; i++) {
        const numDiv = document.getElementById(`tracker-${i}`);
        if (numDiv) {
            if (counts[i] >= 9) {
                numDiv.classList.add('completed');
            } else {
                numDiv.classList.remove('completed');
            }
        }
    }
}

function clearHighlights() {
    cells.forEach(row => row.forEach(cell => {
        cell.classList.remove('highlight', 'match-highlight');
    }));
}

function highlightCross(row, col) {
    for (let i = 0; i < 9; i++) {
        cells[row][i].classList.add('highlight');
        cells[i][col].classList.add('highlight');
    }
}

function highlightMatching(val) {
    if (!val) return;
    cells.forEach(row => row.forEach(cell => {
        if (cell.dataset.value === val.toString()) {
            cell.classList.add('match-highlight');
        }
    }));
}

function createBoard() {
    boardElement.innerHTML = '';
    cells = [];

    for (let r = 0; r < 9; r++) {
        const rowArr = [];
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.tabIndex = 0;
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.dataset.value = "";

            const notesDiv = document.createElement('div');
            notesDiv.className = 'notes';
            for (let i = 1; i <= 9; i++) {
                const noteSpan = document.createElement('span');
                noteSpan.className = `note-${i}`;
                notesDiv.appendChild(noteSpan);
            }

            const valDiv = document.createElement('div');
            valDiv.className = 'value';

            cell.appendChild(notesDiv);
            cell.appendChild(valDiv);

            cell.addEventListener('focus', () => {
                clearHighlights();
                highlightCross(r, c);
                highlightMatching(cell.dataset.value);
                cell.classList.add('focused');
            });

            cell.addEventListener('blur', () => {
                clearHighlights();
                cell.classList.remove('focused');
            });

            cell.addEventListener('keydown', (e) => {
                let nextCell = null;
                if (e.key === 'ArrowUp' && r > 0) nextCell = cells[r - 1][c];
                else if (e.key === 'ArrowDown' && r < 8) nextCell = cells[r + 1][c];
                else if (e.key === 'ArrowLeft' && c > 0) nextCell = cells[r][c - 1];
                else if (e.key === 'ArrowRight' && c < 8) nextCell = cells[r][c + 1];

                if (nextCell) {
                    e.preventDefault();
                    nextCell.focus();
                    return;
                }

                if (cell.classList.contains('read-only')) return;

                messageElement.innerText = '';
                cell.classList.remove('error');

                if (/^[1-9]$/.test(e.key)) {
                    const num = e.key;

                    if (isNotesMode) {
                        if (cell.dataset.value !== "") return;

                        const noteSpan = notesDiv.querySelector(`.note-${num}`);
                        if (noteSpan.innerText === num) {
                            noteSpan.innerText = "";
                        } else {
                            noteSpan.innerText = num;
                        }
                    } else {
                        cell.dataset.value = num;
                        valDiv.innerText = num;

                        for (let i = 1; i <= 9; i++) {
                            notesDiv.querySelector(`.note-${i}`).innerText = "";
                        }

                        updateNumberTracker();

                        // Re-apply highlights instantly for the newly typed number
                        clearHighlights();
                        highlightCross(r, c);
                        highlightMatching(num);
                        cell.classList.add('focused');
                    }
                }
                else if (e.key === 'Backspace' || e.key === 'Delete') {
                    cell.dataset.value = "";
                    valDiv.innerText = "";
                    updateNumberTracker();

                    // Clear match highlights when deleting
                    clearHighlights();
                    highlightCross(r, c);
                    cell.classList.add('focused');
                }
            });

            const val = activePuzzle[r][c];
            if (val !== 0) {
                cell.dataset.value = val;
                valDiv.innerText = val;
                cell.classList.add('read-only');
            }

            boardElement.appendChild(cell);
            rowArr.push(cell);
        }
        cells.push(rowArr);
    }
}

function checkBoard() {
    let isFull = true;
    let isValid = true;

    cells.forEach(row => row.forEach(cell => cell.classList.remove('error')));

    for (let i = 0; i < 9; i++) {
        const rowVals = new Map();
        const colVals = new Map();
        const boxVals = new Map();

        for (let j = 0; j < 9; j++) {
            const rCell = cells[i][j];
            const rVal = rCell.dataset.value;
            if (rVal === "") isFull = false;
            else if (rowVals.has(rVal)) { rCell.classList.add('error'); cells[i][rowVals.get(rVal)].classList.add('error'); isValid = false; }
            else rowVals.set(rVal, j);

            const cCell = cells[j][i];
            const cVal = cCell.dataset.value;
            if (cVal !== "") {
                if (colVals.has(cVal)) { cCell.classList.add('error'); cells[colVals.get(cVal)][i].classList.add('error'); isValid = false; }
                else colVals.set(cVal, j);
            }

            const boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
            const boxCol = 3 * (i % 3) + (j % 3);
            const bCell = cells[boxRow][boxCol];
            const bVal = bCell.dataset.value;
            if (bVal !== "") {
                if (boxVals.has(bVal)) {
                    bCell.classList.add('error');
                    const prevPos = boxVals.get(bVal);
                    cells[prevPos.r][prevPos.c].classList.add('error');
                    isValid = false;
                }
                else boxVals.set(bVal, {r: boxRow, c: boxCol});
            }
        }
    }

    if (!isValid) {
        messageElement.innerText = "There are duplicates. Check the highlighted cells.";
        messageElement.className = '';
    } else if (isValid && isFull) {
        stopTimer();
        const isNewRecord = handleWinRecord(elapsedMs);

        if (isNewRecord) {
            messageElement.innerText = "Correct solve and NEW RECORD!";
        } else {
            messageElement.innerText = "Correct solve!";
        }
        messageElement.className = 'success';
    } else {
        messageElement.innerText = "Looks good so far! Keep going.";
        messageElement.className = 'success';
    }
}

function resetBoard() {
    messageElement.innerText = '';
    messageElement.className = '';

    createBoard();
    updateNumberTracker();

    elapsedMs = 0;
    timerElement.innerText = "00:00.00";
    startTimer();
}

function startNewGame() {
    activePuzzle = generateRandomPuzzle();
    resetBoard();
}

// Initialise the game.
loadBestTime();
createTracker();
startNewGame();
