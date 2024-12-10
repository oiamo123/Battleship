import JoinGame from "../components/JoinGame.js";
import CreateGame from "../components/CreateGame.js";

class App {
  constructor() {
    this.main = document.querySelector(`main`);
    this.back = document.querySelector(`.back`);
    this.initApp();
  }

  addEventListeners() {
    const joinGame = document.querySelector(`.join-game`);
    const createGame = document.querySelector(`.create-game`);

    joinGame.addEventListener(`click`, () => new JoinGame(this));
    createGame.addEventListener(`click`, () => new CreateGame(this));
    this.back.addEventListener(`click`, () => {
      this.back.classList.add("hidden");
      this.initApp();
    });
  }

  startGame() {
    // once the player starts the game, update the player screen as well as all the other players screens
  }

  endGame() {
    // close the connection and return all players to the main screen
  }

  initApp() {
    this.main.innerHTML = "";
    this.main.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="start-menu">
      <p>
        Already have a game started? Click "Join Game", otherwise click "Create
        Game"
      </p>
      <div class="buttons">
        <button class="join-game">Join Game</button>
        <button class="create-game">Create Game</button>
      </div>
      </div>
    `
    );

    this.addEventListeners();
  }
}

new App();

export default App;
