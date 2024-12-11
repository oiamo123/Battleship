class Game {
  constructor() {
    this.players = [];
    this.playerQueue = [];
    this.currentPlayer = 0;
    this.status = "waiting";
    this.questionMarkInterval = 60000; // 1 minute interval
  }

  // add player to game
  addPlayer(player) {
    if (this.status === "started") {
      this.playerQueue.push(player);
    }

    this.players.push(player);
  }

  // go to next player
  nextPlayer() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    return this.players[this.currentPlayer];
  }

  // remove player from game
  removePlayer(player) {
    const index = this.players.indexOf(player);
    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }

  // start the game
  startGame() {
    if (this.players.length === 1) {
      return {
        success: false,
        message: "Cannot start game with only 1 player.",
      };
    }

    this.status = "started";
    this.startQuestionMarkTimer();
  }

  // end the game
  endGame() {
    this.status = "waiting";
    this.players.concat(this.playerQueue);
    clearInterval(this.questionMarkTimer); // Stop the question mark timer
  }

  // attack a player
  attack(name, coords, type) {
    const player = this.players.filter((player) => player.name === name)[0];
    const { x, y } = coords;

    if (type === 0) {
      this.checkForHit(player, x, y);
    } else if (type === 1) {
      this.attackInRange(player, x, y, 1);
    } else if (type === 2) {
      this.attackInRange(player, x, y, 2);
    } else {
      player.specials.set(
        this.weightedRandomChoice(),
        (player.specials.get(type) || 0) + 1
      );
    }
  }

  weightedRandomChoice() {
    const rand = Math.random(); // Generate a random number between 0 and 1
    if (rand <= 0.7) {
      return 1; // 70% chance to pick option 1
    } else {
      return 2; // 30% chance to pick option 2
    }
  }

  // helper methods
  attackInRange(player, x, y, range) {
    const directions = [
      [0, 0], // center
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // down
      [0, -1], // up
    ];

    for (let r = 0; r <= range; r++) {
      for (let dir of directions) {
        this.checkForHit(player, x + r * dir[0], y + r * dir[1]);
      }
    }
  }

  checkForHit(player, x, y) {
    if (
      x >= 0 &&
      y >= 0 &&
      x < player.board.length &&
      y < player.board[0].length
    ) {
      if (player.board[x][y] === "s") {
        player.board[x][y] = "x"; // Mark as hit
      } else {
        player.board[x][y] = "m"; // Mark as miss
      }
    }
  }

  startQuestionMarkTimer() {
    this.questionMarkTimer = setInterval(() => {
      this.placeQuestionMarkRandomly();
    }, this.questionMarkInterval);
  }

  placeQuestionMarkRandomly() {
    const player =
      this.players[Math.floor(Math.random() * this.players.length)];
    const emptyCells = [];

    for (let i = 0; i < player.board.length; i++) {
      for (let j = 0; j < player.board[i].length; j++) {
        if (player.board[i][j] === "s") {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      player.board[randomCell.x][randomCell.y] = "?";
    }
  }

  handleSpecialAttack(player, x, y) {
    if (player.board[x][y] === "?") {
      // Apply the special attack logic
      player.board[x][y] = "s"; // Remove the question mark after the attack
      // Implement the special attack here
    }
  }
}
