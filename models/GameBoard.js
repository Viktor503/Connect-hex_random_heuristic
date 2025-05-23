export let Hexagon_module;

class GameBoard {
  constructor(size, hexsize, material, use_gui) {
    this.size = size;
    this.hexsize = hexsize;
    this.material = material;
    this.board = new Array(size);
    this.use_gui = use_gui;
  }

  async GameBoard_init() {
    if (this.use_gui) {
      await import("./Hexagon.js").then((module) => (Hexagon_module = module));
      let hexagonField = Hexagon_module.hexagonField;
      let first_field_pos = {
        x: 0,
        y: (this.size - 1) * (1 / 2) * this.hexsize,
        z: 0,
      };
      for (let i = 0; i < this.size; i++) {
        if (i != 0) {
          first_field_pos.x -= (7 / 8) * this.hexsize;
          first_field_pos.y -= (1 / 2) * this.hexsize;
          first_field_pos.z = 0;
        }
        this.board[i] = new Array(this.size);
        for (let j = 0; j < this.size; j++) {
          let field_pos = {
            x: first_field_pos.x + (7 / 8) * this.hexsize * j,
            y: first_field_pos.y - (1 / 2) * this.hexsize * j,
            z: first_field_pos.z,
          };
          //print field_pos as string
          this.board[i][j] = new hexagonField(
            0,
            this.hexsize,
            this.material,
            field_pos
          );
          this.board[i][j].createHexagon();
          this.board[i][j].mesh.name = i + "," + j;
        }
      }
    } else {
      for (let i = 0; i < this.size; i++) {
        this.board[i] = new Array(this.size);
        for (let j = 0; j < this.size; j++) {
          this.board[i][j] = 0;
        }
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

  addToScene(scene) {
    this.board.forEach((row) => {
      row.forEach((field) => {
        scene.add(field.mesh);
      });
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
  getDiagonalElements(diagonal_value) {
    let board = this.getBoardValues();
    let diagonal = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (j - i + this.size == diagonal_value && board[i][j] == 0) {
          diagonal.push([i, j]);
        }
      }
    }
    return diagonal;
  }

  getNextEmptyFieldInDiagonal(diagonal_value) {
    let diagonal = this.getDiagonalElements(diagonal_value);
    if (diagonal.length == 0) return null;
    return diagonal[diagonal.length - 1];
  }

  markField(diagonal_value, player) {
    let field = this.getNextEmptyFieldInDiagonal(diagonal_value);
    if (!field) return;
    this.board[field[0]][field[1]] = player == 1 ? 1 : -1;
    return true;
  }
}

export { GameBoard };
