var board = document.getElementById("board");
var cells = board.getElementsByTagName("td");
var player = "X";
var gameActive = true;
var mode = "PVP"; // default mode = player vs player

var scores = { X: 0, O: 0, Draws: 0 };

// scoreboard add
var scoreboard = document.createElement("div");
scoreboard.id = "scoreboard";
scoreboard.innerHTML = `
  <h3>Scoreboard</h3>
  <p>X Wins: <span id="x-score">0</span></p>
  <p>O Wins: <span id="o-score">0</span></p>
  <p>Draws: <span id="draw-score">0</span></p>
`;
document.body.appendChild(scoreboard);

// winner message
var winnerMessage = document.createElement("div");
winnerMessage.className = "winner-message";
document.body.appendChild(winnerMessage);

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", function() {
    if (this.innerHTML === "" && gameActive) {
      this.innerHTML = player;

      if (checkWinner()) {
        endGame(player + " wins! 🎉", player);
        return;
      }

      if (isDraw()) {
        endGame("It's a draw! 🤝", "Draws");
        return;
      }

      player = (player === "X") ? "O" : "X";

      // AI turn agar PVP nahi hai
      if (mode !== "PVP" && player === "O" && gameActive) {
        setTimeout(aiMove, 400);
      }
    }
  });
}

// reset board
var resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", function() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
  }
  player = "X";
  gameActive = true;
  winnerMessage.innerText = "";
});

// winner check
function checkWinner() {
  var winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    return (
      cells[pattern[0]].innerHTML === player &&
      cells[pattern[1]].innerHTML === player &&
      cells[pattern[2]].innerHTML === player
    );
  });
}

// draw check
function isDraw() {
  return [...cells].every(cell => cell.innerHTML !== "");
}

// end game handler
function endGame(message, winner) {
  showMessage(message);
  if (winner !== "Draws") scores[winner]++;
  else scores.Draws++;
  updateScoreboard();
  gameActive = false;
}

// scoreboard update
function updateScoreboard() {
  document.getElementById("x-score").innerText = scores.X;
  document.getElementById("o-score").innerText = scores.O;
  document.getElementById("draw-score").innerText = scores.Draws;
}

// winner message
function showMessage(msg) {
  winnerMessage.innerText = msg;
  setTimeout(() => { winnerMessage.innerText = ""; }, 2000);
}

// game mode set
function setMode(selectedMode) {
  mode = selectedMode;
  resetButton.click();
  showMessage("Mode: " + mode);
}

// AI Move logic
function aiMove() {
  let emptyCells = [...cells].filter(c => c.innerHTML === "");

  if (mode === "Easy") {
    // random move
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.innerHTML = "O";
  } 
  else if (mode === "Medium") {
    // block or win else random
    if (!tryWinOrBlock("O")) {
      if (!tryWinOrBlock("X")) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.innerHTML = "O";
      }
    }
  } 
  else if (mode === "Hard") {
    // best move with minimax
    let bestMove = minimax([...cells].map(c => c.innerHTML), "O").index;
    cells[bestMove].innerHTML = "O";
  }

  if (checkWinner()) {
    endGame("O wins! 🤖", "O");
    return;
  }

  if (isDraw()) {
    endGame("It's a draw! 🤝", "Draws");
    return;
  }

  player = "X";
}

// Medium helper (win/block)
function tryWinOrBlock(symbol) {
  let winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of winPatterns) {
    let [a,b,c] = pattern;
    let vals = [cells[a].innerHTML, cells[b].innerHTML, cells[c].innerHTML];
    if (vals.filter(v => v === symbol).length === 2 && vals.includes("")) {
      cells[pattern[vals.indexOf("")]].innerHTML = "O";
      return true;
    }
  }
  return false;
}

// Minimax (Hard AI)
function minimax(newBoard, playerAI) {
  let availSpots = newBoard.map((v,i) => v === "" ? i : null).filter(v => v !== null);

  if (winning(newBoard, "X")) return {score: -10};
  if (winning(newBoard, "O")) return {score: 10};
  if (availSpots.length === 0) return {score: 0};

  let moves = [];

  for (let i=0; i<availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = playerAI;

    if (playerAI === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (playerAI === "O") {
    let bestScore = -10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function winning(board, player) {
  let winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(p => 
    board[p[0]] === player && board[p[1]] === player && board[p[2]] === player
  );
}

// icons functions
function share() {
  alert("Share functionality coming soon! 🔗");
}

function like() {
  alert("Thanks for liking the game 👍");
}
