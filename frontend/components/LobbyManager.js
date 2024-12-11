class LobbyManager {
  constructor(App, joiningGame) {
    this.App = App;
    this.curInput = 0;
    this.inputs = [];
    this.message;
    this.joiningGame = joiningGame;
    this.init();
    this.socket = io("http://localhost:3000");
  }

  init() {
    // Clear the main content before rendering
    this.App.main.innerHTML = "";
    this.App.back.classList.remove("hidden");

    if (this.joiningGame) {
      this.renderJoinGame();
    } else {
      this.renderCreateGame();
    }

    this.addEventHandlers();
  }

  renderJoinGame() {
    const joinGameHTML = `
      <div class="join-game-container">
        <h2>Enter Game Code</h2>
        <div class="inputs">
          <input maxlength="1">
          <input maxlength="1">
          <input maxlength="1">
          <input maxlength="1">
        </div>
        <button class="join-button">Join</button>
        <p class="message"></p>
      </div>
    `;
    this.App.main.insertAdjacentHTML("beforeend", joinGameHTML);
    this.message = document.querySelector(".message");
    this.inputs = document.querySelectorAll(".inputs input");
  }

  renderCreateGame() {
    const createGameHTML = `
      <div class="create-game-container">
        <div>
          <label for="name">Please enter your name:</label>
          <input id="name" type="text">
        </div>
        <button>Confirm</button>
      </div>
    `;
    this.App.main.insertAdjacentHTML("beforeend", createGameHTML);
    this.message = document.querySelector(".message");
  }

  addEventHandlers() {
    if (this.joiningGame) {
      this.addJoinGameHandlers();
    } else {
      this.addCreateGameHandlers();
    }
  }

  addJoinGameHandlers() {
    const firstInput = this.inputs[0];
    const joinButton = document.querySelector(".join-button");

    // Focus on the first input on page load
    firstInput.focus();

    // Event listeners for input behavior
    this.inputs.forEach((input, index) => {
      input.addEventListener("keyup", (e) => this.onKeyUp(e, index));
      input.addEventListener("click", () => (this.message.textContent = ""));
    });

    // Event listener for join button click
    joinButton.addEventListener("click", () => this.joinGame());
    firstInput.addEventListener("paste", (e) => this.handlePaste(e));
  }

  addCreateGameHandlers() {
    const nameInput = document.querySelector("#name");
    const confirmButton = this.App.main.querySelector("button");

    // Event listener for confirm button
    confirmButton.addEventListener("click", () =>
      this.createGame(nameInput.value)
    );
  }

  handlePaste(e) {
    e.preventDefault();

    const text = (e.clipboardData || e.originalEvent.clipboardData).getData(
      "text"
    );
    const numbers = text.match(/\d/g);

    // Handle paste event for game code input
    numbers.forEach((number) => {
      this.inputs[this.curInput].value = number;
      this.curInput++;
      if (this.curInput >= this.inputs.length) {
        this.curInput = 0;
      }
    });
  }

  onKeyUp(e, index) {
    if (e.key >= 0 && e.key <= 9 && index < this.inputs.length - 1) {
      this.inputs[index].value = e.key;
      this.curInput = index + 1;
      this.inputs[this.curInput].focus();
    }
  }

  getGameCode() {
    return Array.from(this.inputs)
      .map((input) => input.value)
      .join("");
  }

  async joinGame() {
    const code = this.getGameCode();
    if (code.length !== 4) {
      this.message.textContent = "Invalid Game Code!";
      return;
    }

    this.socket.emit(
      "join-game",
      { roomId: code, player: { name: this.playerName } },
      (data) => {
        if (data.success) {
          this.message.textContent = `Joined Game: ${code}`;
          // go to ship placement page
        } else {
          this.message.textContent = "Game not found!";
        }
      }
    );
  }

  async createGame(name) {
    if (!name) {
      this.message.textContent = "Please enter a name!";
      return;
    }

    this.socket.emit("create-game", { name }, (data) => {
      if (data.success) {
        this.message.textContent = `Game Created! Share your Game ID: ${data.roomId}`;
        // go to ship placement page
      } else {
        this.message.textContent = "Failed to create game.";
      }
    });
  }
}

export default LobbyManager;
