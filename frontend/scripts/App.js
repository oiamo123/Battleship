import LobbyManager from "../components/LobbyManager.js";

class App {
  constructor() {
    this.main = document.querySelector(`main`);
    this.back = document.querySelector(`.back`);
    this.insertHTML();
    this.pages = [];
  }

  addEventListeners() {
    const joinGame = document.querySelector(`.join-game`);
    const createGame = document.querySelector(`.create-game`);

    joinGame.addEventListener(`click`, () => this.startLobbyManager(true));

    createGame.addEventListener(`click`, () => this.startLobbyManager(false));

    this.back.addEventListener(`click`, () => {
      const page = this.pages.pop();
      if (page instanceof App) {
        this.back.classList.add("hidden");
      }
      page.insertHTML();
    });
  }

  insertHTML() {
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

  startLobbyManager(joiningGame) {
    this.pages.push(this);
    new LobbyManager(this, joiningGame);
  }
}

new App();
