import { Game } from "./models/Game.js";
import { GameBoard } from "./models/GameBoard.js";

const BOARDSIZE = 4
const TESTS_LENGTH = 1000;


function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function randomColumn(possible_collumns) {
  return possible_collumns[randomInt(possible_collumns.length) - 1];
}


function topFieldInColumn(column, gameBoard) {
  for (let i = gameBoard.length - 1; i >= 0; i--) {
    for(let j= 0; j < gameBoard[i].length; j++){
      if(j-i+gameBoard.length == column && gameBoard[i][j] != 0){
        return gameBoard[i][j];
      }
    }
  }
  return 0;
}


function testStrategy(possible_collumns, gameBoard) {
  if(possible_collumns.includes(gameBoard.board.length*2-1)){
    return gameBoard.board.length*2-1;
  }
  for (let index = possible_collumns.length-1; index > 0; index--) {
    let topfield = topFieldInColumn(possible_collumns[index], gameBoard.board);
    if (topfield == 1) {
      return possible_collumns[index];
    }    
  }
  return columnWithOddMissing(possible_collumns, gameBoard);
}

function columnWithOddMissing(possible_collumns,gameBoard){
  for (let index = possible_collumns.length-1; index >= 0; index--) {
    let column = possible_collumns[index];
    let fields = []
    for (let i = 0; i < gameBoard.board.length; i++) {
      for(let j = 0; j < gameBoard.board[i].length; j++){
        if(j-i+gameBoard.board.length == column && gameBoard.board[i][j] == 0){
          fields.push(gameBoard.board[i][j])
        }
      }
    }
    if (fields.length % 2 == 1) {
      return column;
    }
    
  }
  return possible_collumns[possible_collumns.length-1];
  
}



let wins = { 1: 0, 2: 0 };
for (let index = 0; index < runs; index++) {
  let gameBoard = new GameBoard(BOARDSIZE, 1, null);
  gameBoard.GameBoard_init();
  let game = new Game(gameBoard);

  let usable_collumns = [];
  for (let i = 0; i < BOARDSIZE * 2 - 1; i++) {
    usable_collumns.push(i + 1);
  }

  let prev_player = 0;
  let next_column;
  while (true) {
    if (game.currentPlayer == prev_player) {
      usable_collumns = usable_collumns.filter(
        (value) => value != next_column
      );
    }
    prev_player = game.currentPlayer;
    if (game.currentPlayer == 1){
      next_column = randomColumn(usable_collumns);
    } else {
      next_column = randomColumn(usable_collumns,gameBoard);
    }
    console.log(next_column)
    
    if (!game.markField(next_column)) {
      wins[game.winner] += 1;
      break;
    }
}
}
console.log(wins);
