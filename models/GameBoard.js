export let Hexagon_module;

class GameBoard {
  constructor(size, hexsize, material) {
    this.size = size;
    this.hexsize = hexsize;
    this.material = material;
    this.board = new Array(size);
  }

  async GameBoard_init() {
    for (let i = 0; i < this.size; i++) {
      this.board[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  getBoard() {
    return this.board;
  }

  getBoardValues() {
    if (!this.use_gui) return this.getBoard();

    let board = [];
    this.board.forEach((row) => {
      let row_values = [];
      row.forEach((field) => {
        row_values.push(field.value);
      });
      board.push(row_values);
    });
    return board;
  }

  getPlayerFields(player) {
    let player_fields = [];
    let valueBoard = this.getBoardValues();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (valueBoard[i][j] == (player == 1 ? 1 : -1)) {
          player_fields.push([i, j]);
        }
      }
    }
    return player_fields;
  }

  printBoard() {
    let board = this.getBoardValues();
    board.forEach((row) => {
      console.log(row);
    });
  }

  getCoordinatesFromName(name) {
    let [x, y] = name.split(",");
    return [parseInt(x), parseInt(y)];
  }

  getColumn(name) {
    let [x, y] = this.getCoordinatesFromName(name);
    let column_number = y - x + this.size;
    return column_number;
  }
  getDiagonalElements(name) {
    let [x, y] = this.getCoordinatesFromName(name);
    let diagonal = [];
    let column = y - x;
    x = 0;
    y = 0;
    if (column > 0) {
      y += column;
    } else {
      x -= column;
    }
    while (this.board[x][y] == 0) {
      diagonal.push([x, y]);
      x++;
      y++;
      if (x > this.size - 1 || y > this.size - 1) break;
    }
    return diagonal;
  }

  getNextEmptyFieldInDiagonal(diagonal_value) {
    let diagonal = this.getDiagonalElements(diagonal_value);
    if (diagonal.length == 0) return null;
    return diagonal[diagonal.length - 1];
  }

  markField(name, player, hex_mode) {
    let field;
    if (hex_mode) {
      let [x, y] = this.getCoordinatesFromName(name);
      field = this.board[x][y] == 0 ? [x, y] : null;
    } else {
      field = this.getNextEmptyFieldInDiagonal(name);
    }
    if (!field) return;
    this.board[field[0]][field[1]] = player == 1 ? 1 : -1;

    return true;
  }
}

export { GameBoard };
