let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let mode = "";
let scores = { X: 0, O: 0, D: 0 };

const boardEl = document.getElementById("board");
const statusText = document.getElementById("statusText");
const screens = document.querySelectorAll(".screen");

function switchScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startGame(selectedMode) {
  mode = selectedMode;
  newMatch();
  switchScreen("gameScreen");
}

function createBoard() {
  boardEl.innerHTML = "";
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    boardEl.appendChild(cell);
  }
  updateStatus();
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  makeMove(index, currentPlayer);
  if (checkWinner()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = boardEl.children[index];
  cell.textContent = player;
  cell.classList.add("disabled");
}

function aiMove() {
  const move =
    findCriticalMove("O") ??
    findCriticalMove("X") ??
    randomMove();

  makeMove(move, "O");
  if (!checkWinner()) {
    currentPlayer = "X";
    updateStatus();
  }
}

function findCriticalMove(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const marks = combo.map(i => board[i]);
    if (marks.filter(m => m === player).length === 2 && marks.includes("")) {
      return combo[marks.indexOf("")];
    }
  }
  return null;
}

function randomMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combo.forEach(i => boardEl.children[i].classList.add("win"));
      endGame(board[a]);
      return true;
    }
  }

  if (!board.includes("")) {
    scores.D++;
    updateScores();
    statusText.textContent = "It's a Draw 🤝";
    gameActive = false;
    return true;
  }
  return false;
}

function endGame(winner) {
  scores[winner]++;
  updateScores();
  statusText.className = "status win";
  statusText.textContent = `Player ${winner} Wins 🎉`;
  gameActive = false;
}

function updateStatus() {
  statusText.className =
    "status " + (currentPlayer === "X" ? "x-turn" : "o-turn");
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.D;
}

/* MENU ACTIONS */
function playAgain() {
  createBoard();
}

function newMatch() {
  scores = { X: 0, O: 0, D: 0 };
  updateScores();
  createBoard();
}

function goHome() {
  newMatch();
  switchScreen("modeScreen");
}
