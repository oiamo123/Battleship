class CreateGame {
  constructor(App) {
    this.App = App;
    this.insertHTML();
  }

  insertHTML() {
    this.App.main.innerHTML = "";
    this.App.back.classList.toggle("hidden");

    this.App.main.insertAdjacentHTML(
      "beforeend",
      `
        <div class="create-game-container">
            <label for="name">Please enter your name:</label>
            <input id="name" type="text">
        </div>
        `
    );
  }
}

export default CreateGame;
