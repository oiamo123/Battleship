class JoinGame {
  constructor(App) {
    this.App = App;
    this.curInput = 0;
    this.inputs = [];
    this.insertHTML();
    this.join = document.querySelector(`.join-button`);
    this.addEventHandlers();
  }

  insertHTML() {
    this.App.main.innerHTML = "";
    this.App.back.classList.toggle("hidden");

    const joinGameHTML = `
        <div class="join-game-container">
          <h2>Enter Game Code</h2>
          <div class="inputs">
            <input maxlength="1"></input>
            <input maxlength="1"></input>
            <input maxlength="1"></input>
            <input maxlength="1"></input>
          </div>
          <button class="join-button">Join</button>
        </div>
      `;

    document
      .querySelector("main")
      .insertAdjacentHTML("beforeend", joinGameHTML);
  }

  addEventHandlers() {
    const inputs = document.querySelectorAll(".inputs input");
    const firstInput = inputs[0];
    this.inputs = inputs;

    this.join.addEventListener(`click`, () => {
      const code = this.getGameCode();
      // get data and check if you have to wait or not
    });

    firstInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || e.originalEvent.clipboardData).getData(
        "text"
      );
      const numbers = text.match(/\d/g);

      numbers.forEach((number) => {
        inputs[this.curInput].value = number;
        this.curInput++;
        if (this.curInput >= inputs.length) {
          this.curInput = 0;
        }
      });
    });

    inputs.forEach((input, index) => {
      input.addEventListener("keyup", (e) => {
        if (e.key >= 0 && e.key <= 9 && index < inputs.length - 1) {
          inputs[index].value = e.key;
          this.curInput = index + 1;
          inputs[this.curInput].focus();
        }
      });
    });
  }

  getGameCode() {
    return Array.from(this.inputs)
      .map((input) => input.value)
      .join("");
  }
}

export default JoinGame;
