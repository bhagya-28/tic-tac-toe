const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let gameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  gameOver: false,
  winner: null
};

// Check for a winner
function checkWinner() {
  const b = gameState.board;
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (const [a,b,c] of lines) {
    if (gameState.board[a] && gameState.board[a] === gameState.board[b] && gameState.board[a] === gameState.board[c]) {
      gameState.winner = gameState.board[a];
      gameState.gameOver = true;
      return;
    }
  }

  // Check for draw
  if (!gameState.board.includes("")) {
    gameState.winner = "Draw";
    gameState.gameOver = true;
  }
}

// Reset game
app.post('/reset', (req, res) => {
  gameState = {
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "X",
    gameOver: false,
    winner: null
  };
  res.json(gameState);
});

// Get game state
app.get('/state', (req, res) => {
  res.json(gameState);
});

// Make a move
app.post('/move', (req, res) => {
  const { index } = req.body;
  if (gameState.gameOver) {
    return res.status(400).json({ message: "Game over" });
  }
  if (gameState.board[index] !== "") {
    return res.status(400).json({ message: "Cell already occupied" });
  }

  gameState.board[index] = gameState.currentPlayer;
  checkWinner();

  if (!gameState.gameOver) {
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
  }

  res.json(gameState);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});