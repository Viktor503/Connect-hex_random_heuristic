import { Game } from "./models/Game.js";
import { GameBoard } from "./models/GameBoard.js";

const BOARDSIZE = 5;
const TESTS_LENGTH = 10000;
const HEX_MODE = false;
const MISERE_MODE = false;

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// outputs the highest field from the column
function columnToCoordinate(column, gameState) {
  // c = y - x + n
  // We can set y to be zero and we know n, so we can get a coordinate to mark
  // y = c - n
  const n = gameState.length;
  if (column > n) {
    return [0, column - n];
  } else {
    return [n - column, 0];
  }
}

// Outputs the lowest field from the column
function columnToBottomCoordinate(column, gameStatelength) {
  const n = gameStatelength;
  if (column > n) {
    return [2 * n - 1 - column, n - 1];
  } else {
    return [n - 1, column - 1];
  }
}

function randomStrategy(gameState, firstField) {
  if (HEX_MODE) {
    if (firstField) {
      if (gameState[firstField[0]][firstField[1]] == 0) {
        return [firstField[0], firstField[1]];
      }
    }

    // Loop through the gameState and find all empty fields
    let usable_fields = [];
    for (let i = 0; i < gameState.length; i++) {
      for (let j = 0; j < gameState[i].length; j++) {
        if (gameState[i][j] == 0) {
          usable_fields.push([i, j]);
        }
      }
    }
    // Return a random empty field
    return usable_fields[randomInt(usable_fields.length)];
  } else {
    if (firstField) {
      if (gameState[firstField[0]][firstField[1]] == 0) {
        return [firstField[0], firstField[1]];
      }
    }

    // Loop through the gameState and find all usable columns
    let usable_collumns = [];
    for (let i = 1; i < gameState.length * 2; i++) {
      const coords = columnToCoordinate(i, gameState);
      if (gameState[coords[0]][coords[1]] === 0) {
        usable_collumns.push(i);
      }
    }
    let x = usable_collumns[randomInt(usable_collumns.length)];
    // Return an empty field
    return columnToCoordinate(x, gameState);
  }
}

function columnWithOddMissing(gameBoard, direction = "R") {
  // Loop through the gameState and find all usable columns
  let possible_collumns = [];
  for (let i = 1; i < gameBoard.length * 2; i++) {
    const coords = columnToCoordinate(i, gameBoard);
    if (gameBoard[coords[0]][coords[1]] === 0) {
      possible_collumns.push(i);
    }
  }

  if (direction == "R") {
    // Loop through the columns in reverse order
    // and check if the column has an odd number of empty fields
    // If it does, return the column
    for (let index = possible_collumns.length - 1; index >= 0; index--) {
      let column = possible_collumns[index];
      let fields = [];
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
          if (j - i + gameBoard.length == column && gameBoard[i][j] == 0) {
            fields.push(gameBoard[i][j]);
          }
        }
      }
      if (fields.length % 2 == 1) {
        return columnToCoordinate(column, gameBoard);
      }
    }
    // If no column has an odd number of empty fields, return the last column
    return columnToCoordinate(
      possible_collumns[possible_collumns.length - 1],
      gameBoard
    );
  } else if (direction == "L") {
    // Loop through the columns in order
    // and check if the column has an odd number of empty fields
    // If it does, return the column
    for (let index = 0; index < possible_collumns.length; index++) {
      let column = possible_collumns[index];
      let fields = [];
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
          if (j - i + gameBoard.length == column && gameBoard[i][j] == 0) {
            fields.push(gameBoard[i][j]);
          }
        }
      }
      if (fields.length % 2 == 1) {
        return columnToCoordinate(column, gameBoard);
      }
    }
    // If no column has an odd number of empty fields, return the first column
    return columnToCoordinate(possible_collumns[0], gameBoard);
  }
}

// Function for running a test with two strategies
// player1 and player2 are functions that take a gameState and return a field
// This function uses the global variables defined at the top of the file
function run_test(player1, player2, verbose = false) {
  // Loop untill we have TESTS_LENGTH tests
  let wins = { 1: 0, 2: 0 };
  for (let index = 0; index < TESTS_LENGTH; index++) {
    // Clear the game board and the game
    let gameBoard = new GameBoard(BOARDSIZE, 1, null);
    gameBoard.GameBoard_init();
    let game = new Game(gameBoard, MISERE_MODE);

    let next_field;
    let board;
    // Loop until we have a winner
    while (true) {
      board = game.gameBoard.getBoard();
      if (game.currentPlayer == 1) {
        next_field = player1(board);
      } else {
        next_field = player2(board);
      }

      next_field = `${next_field[0]},${next_field[1]}`;
      game.markField(next_field, HEX_MODE, true, true);
      if (game.winner) {
        // If the game is over, check who won add it to counter
        wins[game.winner] += 1;
        break;
      }
    }
  }
  if (verbose) {
    console.log(wins);
    console.log("Player 1 wins", (wins[1] / TESTS_LENGTH) * 100, "%");
  }
  // Return the wins for player 1 and player 2
  return wins;
}

// Here player 1 is a random player and player 2 playe ODDEMPTYRIGHT
// We loop through all the starting fields for player 1 and test them individually
function random_vs_ODDEMPTYRIGHT() {
  let player1_starting_fields = [];
  for (let i = 1; i < BOARDSIZE * 2; i++) {
    player1_starting_fields.push(columnToBottomCoordinate(i, BOARDSIZE));
  }

  let player1;
  let player2;
  let result;
  for (let i = 0; i < player1_starting_fields.length; i++) {
    player1 = (board) => randomStrategy(board, player1_starting_fields[i]);
    player2 = (board) => columnWithOddMissing(board, "R");
    result = run_test(player1, player2, false);
    console.log(
      "Player 1 wins",
      (result[1] / TESTS_LENGTH) * 100,
      "%",
      "with starting field",
      player1_starting_fields[i]
    );
  }
}

// Here player 1 playe ODDEMPTYLEFT and player 2 is a random player
// We loop through all the starting fields for player 2 and test them individually (just like above)
function ODDEMPTYLEFT_vs_random() {
  let player2_starting_fields = [];
  for (let i = 1; i < BOARDSIZE * 2; i++) {
    player2_starting_fields.push(columnToBottomCoordinate(i, BOARDSIZE));
  }

  let player1;
  let player2;
  let result;
  for (let i = 0; i < player2_starting_fields.length; i++) {
    player1 = (board) => columnWithOddMissing(board, "L");
    player2 = (board) => randomStrategy(board, player2_starting_fields[i]);
    result = run_test(player1, player2, false);
    console.log(
      "Player 1 wins",
      (result[1] / TESTS_LENGTH) * 100,
      "%",
      "with starting field",
      player2_starting_fields[i]
    );
  }
}

let player1 = (board) => columnWithOddMissing(board, "L");
let player2 = (board) => randomStrategy(board);
let result = run_test(player1, player2, true);
