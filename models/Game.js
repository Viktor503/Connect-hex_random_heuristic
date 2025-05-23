import { Queue } from "./Queue.js";

class Game {
  constructor(gameBoard, misereMode = false) {
    this.gameBoard = gameBoard;
    this.misereMode = misereMode;
    this.currentPlayer = 1;
    this.winner = null;
    this.verbose = false;
  }
  validField(x, y) {
    return (
      x >= 0 && x < this.gameBoard.size && y >= 0 && y < this.gameBoard.size
    );
  }
  returnNeighbours(i, j) {
    let neighbours = [
      [i - 1, j - 1],
      [i - 1, j],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j],
      [i + 1, j + 1],
    ];
    return neighbours;
  }

  isStartEdge(x, y, player) {
    return (x == 0 && player == 1) || (y == 0 && player == 2);
  }
  isEndEdge(x, y, player) {
    return (
      (x == this.gameBoard.size - 1 && player == 1) ||
      (y == this.gameBoard.size - 1 && player == 2)
    );
  }

  bfsToGetReachableFields(player_fields, player) {
    let board = this.gameBoard.getBoardValues();
    let queue = new Queue();
    let visited = new Set();
    queue.enqueue(player_fields[0]);

    while (queue.length() > 0) {
      let [i, j] = queue.dequeue();
      let vertexName = i + "," + j;
      if (!(vertexName in visited)) {
        visited.add(vertexName);
        let neighbours = this.returnNeighbours(i, j);
        neighbours.forEach((neighbour) => {
          let [x, y] = neighbour;
          let neighbourName = x + "," + y;
          if (
            this.validField(x, y) &&
            board[x][y] == (player == 1 ? 1 : -1) &&
            !visited.has(neighbourName)
          ) {
            queue.enqueue(neighbour);
          }
        });
      }
    }
    return visited;
  }

  checkIfFieldsAreWinning(player_fields, player) {
    let startEdgeFound = false;
    let endEdgeFound = false;
    player_fields.forEach((field) => {
      let [i, j] = field;
      startEdgeFound = startEdgeFound || this.isStartEdge(i, j, player);
      endEdgeFound = endEdgeFound || this.isEndEdge(i, j, player);
    });
    // console.log("Start edge found:", startEdgeFound);
    // console.log("End edge found:", endEdgeFound);
    if (startEdgeFound && endEdgeFound) {
      if (this.misereMode) {
        this.winner = player == 1 ? 2 : 1;
      } else {
        this.winner = player;
      }
      // await this.gameBoard.flashFields.then(() => {
      //     console.log("Player " + player + " wins!");
      // });
      if (this.verbose) {
        console.log("**********************************************");
        console.log("Player " + player + " wins!");
        console.log("**********************************************");
      }
      return player;
    }
  }

  winCheck(player = this.currentPlayer) {
    let board = this.gameBoard;

    let playerFields = this.gameBoard.getPlayerFields(player);
    while (playerFields.length > 0) {
      let playerVisitedSetStrings = this.bfsToGetReachableFields(
        playerFields,
        player
      );
      let playerVisitedFields = Array.from(playerVisitedSetStrings).map(
        (field) => field.split(",").map((x) => parseInt(x))
      );
      this.checkIfFieldsAreWinning(playerVisitedFields, player);
      playerFields = playerFields.filter(
        (field) => !playerVisitedSetStrings.has(field[0] + "," + field[1])
      );
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
  }

  markField(name, hex_mode, switchPlayer = true, winCheck = true) {
    if (this.winner) return;
    if (this.gameBoard.markField(name, this.currentPlayer, hex_mode)) {
      if (winCheck) this.winCheck();
      if (switchPlayer) this.switchPlayer();
      return true;
    }
  }
}

export { Game };
