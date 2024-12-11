class Player {
  constructor(name) {
    this.name = name;
    this.board = [];
    this.specials = new Map();
  }

  generateBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = "e";
      }
    }
  }

  placeShip(start, end) {
    const { x1, y1 } = start;
    const { x2, y2 } = end;
    for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        this.board.ships[i][j] = "s";
      }
    }
  }
}
