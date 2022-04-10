const COUNT = 9;
const boardElement = document.getElementById("board");
let board = new Array(9);
let focusedTile;
let gameOver;
let stop;

for (let i = 0; i < COUNT; i++) {
    for (let j = 0; j < COUNT; j++) {
        let tile = document.createElement("span");
        tile.setAttribute("id", i.toString() + "-" + j.toString());
        tile.classList.add("tile");
        boardElement.appendChild(tile);
    }
}

allTiles = document.querySelectorAll(".tile");
allTiles.forEach((tile) => {
    if (gameOver) return;
    tile.addEventListener("click", (_) => {
        allTiles.forEach((tile) => {
            tile.classList.remove("focus");
        });
        tile.classList.add("focus");
        focusedTile = tile;
    });
});
document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    if (isNaN(e.key) && e.key != "Backspace") return;
    if (focusedTile) {
        if (focusedTile.innerText !== "" && e.key === "Backspace")
            focusedTile.innerText = "";
        else if (e.key !== "Backspace") {
            focusedTile.innerText = e.key;
            focusedTile.classList.add("original");
        }
    }
});
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("tile")) {
        allTiles.forEach((tile) => tile.classList.remove("focus"));
    }
});
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const updateUI = async () => {
    for (let i = 0; i < COUNT; i++) {
        for (let j = 0; j < COUNT; j++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            await sleep(10);
            tile.innerText = board[i][j];
        }
    }


};

const isValidPlacement = (board, number, row, column) => {
    for (let i = 0; i < COUNT; i++) {
        if (board[row][i] === number) {
            return false;
        }
    }
    for (let i = 0; i < COUNT; i++) {
        if (board[i][column] === number) {
            return false;
        }
    }
    let localBoxRow = row - (row % 3);
    let localBoxColumn = column - (column % 3);
    for (let i = localBoxRow; i < localBoxRow + 3; i++) {
        for (let j = localBoxColumn; j < localBoxColumn + 3; j++) {
            if (board[i][j] === number) {
                return false;
            }
        }
    }
    return true;
};

const isValidBoard = (board) => {
    let nums = [];
    for (let i = 0; i < COUNT; i++) {
        nums = [];
        for (let j = 0; j < COUNT; j++) {
            if (board[i][j] === 0) continue;
            if (nums.includes(board[i][j])) {
                return false;
            }
            nums.push(board[i][j]);
        }
    }
    for (let i = 0; i < COUNT; i++) {
        nums = [];
        for (let j = 0; j < COUNT; j++) {
            if (board[j][i] === 0) continue;
            if (nums.includes(board[j][i])) {
                return false;
            }
            nums.push(board[j][i]);
        }
    }
    for (let localRow = 0; localRow < 3; localRow++) {
        for (let localCol = 0; localCol < 3; localCol++) {
            nums = [];
            for (let i = localRow * 3; i < localRow * 3 + 3; i++) {
                for (let j = localCol * 3; j < localCol * 3 + 3; j++) {
                    if (board[i][j] === 0) continue;
                    if (nums.includes(board[i][j])) return false;
                    nums.push(board[i][j]);
                }
            }
        }
    }
    return true;
};

const solveBoard = (board) => {
    for (let i = 0; i < COUNT; i++) {
        for (let j = 0; j < COUNT; j++) {
            if (board[i][j] === 0) {
                for (let number = 1; number <= COUNT; number++) {
                    if (isValidPlacement(board, number, i, j)) {
                        board[i][j] = number;
                        if (solveBoard(board)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const generateBoard = () => {
    for (let i = 0; i < COUNT; i++) {
        let row = new Array(9);
        for (let j = 0; j < COUNT; j++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            row[j] = tile.innerText === "" ? 0 : parseInt(tile.innerText);
        }
        board[i] = row;
    }
};
document.getElementById("solve-btn").addEventListener("click", async (_) => {
    generateBoard();
    stop = false;
    for (let i = 0; i < COUNT; i++) {
        for (let j = 0; j < COUNT; j++) {
            if (!isValidBoard(board)) {
                alert("Invalid Board!");
                stop = true;
            }

            if (stop) break;
        }
        if (stop) break;
    }
    if (!stop) {
        solveBoard(board);
        updateUI();
        gameOver = true;
    }
});

document.getElementById("reset-btn").addEventListener("click", (_) => {
    gameOver = false;
    board = new Array(9);
    allTiles.forEach((tile) => {
        tile.innerText = "";
        tile.classList.remove("focus");
        tile.classList.remove("original");
    });
});
