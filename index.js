class Die {
  constructor(i) {
    this.isActive = true;
    this.rollingDieHTML = document.getElementById(`rolling-dice-${i}`);
    this.rollingDieHTML.classList.remove("inactive-dice");
    this.rollingDieHTML.classList.add("active-dice");
    this.rollingDieHTML.src = "";
    let thisDie = this;
    this.rollingDieHTML.addEventListener("click", function() {
      thisDie.toggleDie();
    });

    this.keepAreaHTML = document.getElementById(`keep-area-${i}`);
    this.keepAreaHTML.innerHTML = "";
    this.keepAreaHTML.addEventListener("click", function() {
      thisDie.toggleDie();
    })

    document.querySelector(".btn-roll-dice").disabled = false;
  }

  roll() {
    if (this.isActive) {
      this.value = Die.numberBetween(1, 6);
      this.left = Die.numberBetween(0, 43) + "%";
      this.top = Die.numberBetween(0, 75) + "%";
      this.transform = "rotate(" + Die.numberBetween(0, 359) + "deg)";
    }
  }

  toggleDie() {
    if (this.isActive) {
      this.keepAreaHTML.innerHTML = "<img src='" + this.rollingDieHTML.src + "' class=''>";
      this.rollingDieHTML.classList.replace("active-dice", "inactive-dice");
      this.isActive = false;
    } else {
      this.keepAreaHTML.innerHTML = "";
      this.rollingDieHTML.classList.replace("inactive-dice", "active-dice");
      this.isActive = true;
    }
  }

  static numberBetween(start, end) {
    return Math.floor(Math.random() * (end + 1 - start) + start);
  }

}

class Round {
  constructor(game) {
    this.rollNumber = 0;
    this.isAtOnce = true;
    this.allDice = [new Die(1), new Die(2), new Die(3), new Die(4), new Die(5)];
    this.game = game
  }

  getValues() {
    var diceValues = [];
    for (const die of this.allDice) {
      diceValues.push(die.value);
    }
    return diceValues;
  }

  rollActiveDice() {
    if (this.rollNumber < 3) {
      this.rollNumber++;
      this.isAtOnce = this.allDice.filter(isActiveDie).length === 5;

      for (var i = 0; i < this.allDice.length; i++) {
        if (this.allDice[i].isActive) {
          this.allDice[i].roll();
          this.allDice[i].rollingDieHTML.style.left = this.allDice[i].left;
          this.allDice[i].rollingDieHTML.style.top = this.allDice[i].top;
          this.allDice[i].rollingDieHTML.style.transform = this.allDice[i].transform;
          this.allDice[i].rollingDieHTML.setAttribute("src", "images/dice" + this.allDice[i].value + ".png");
        }
      }
      if (this.rollNumber > 2) {
        document.querySelector(".btn-roll-dice").disabled = true;
      }
    }
  }


  getScores() {
    let scores = [];
    for (let i = 0; i < game.comb.length; ++i) {
      scores.push(this.combinationPoints(game.comb[i]));
    }
    return scores;
  }

  combinationPoints(c) {
    let values = this.getValues();
    if (typeof c === "number") {
      let select = values.filter(v => v === c);
      return select.length * c;
    } else {
      switch (c) {
        case "Three of a kind":
          if (nOfAKind(3, values)) {
            return sumOfValues(values);
          }
          return 0;

        case "Four of a kind":
          if (nOfAKind(4, values)) {
            return sumOfValues(values);
          }
          return 0;

        case "Full House":
          let i = nOfAKind(3, values);
          if (i && nOfAKind(2, values.filter(v => v != i))) {
            return 25;
          }
          return 0;

        case "Small Straight":
          if (straight(values) >= 3) {
            return 30;
          }
          return 0;

        case "Large Straight":
          if (straight(values) >= 4) {
            return 40;
          }
          return 0;

        case "Chance":
          return sumOfValues(values);
          return 0;

        case "Yam":
          if (nOfAKind(5, values)) {
            return 50;
          }
          return 0;
      }
    }
  }
}


// **** HELPER FUNCTIONS **** //
function nOfAKind(n, values) {
  for (let i = 6; i > 0; i--) {
    if (values.filter(v => v === i).length >= n) {
      return i;
    }
  }
  return false;
}

function sumOfValues(values) {
  return values.reduce((a, b) => a + b);
}

function straight(values) {
  // the next line sorts and remove duplicates
  let sorted = [...new Set(values.sort())];
  let count = 0;
  let biggerCount = 0;
  for (let i = 0; i < 5; i++) {
    if (sorted[i] + 1 === sorted[i + 1]) {
      ++count;
    } else if (count > biggerCount) {
      biggerCount = count;
      count = 0;
    }
  }
  return biggerCount;
}

function isActiveDie(die) {
  return die.isActive;
}




// **** GAME ****
// 1. User selects n players + launch game (button instead of grid)
// 2. Game is created:
// -> grid is created for n players
// -> make rollButton available
// -> create first round
// 3. User click on rollButton
// 4. Round is created:
// -> 5 dice are created
// ->



class Game {
  constructor(n) {
    this.numberOfPlayers = n; // future development
    // Here: insert method to create grid for n players
    let thisGame = this;
    document.querySelector(".btn-roll-dice").addEventListener("click", function() {
      thisGame.rollButton()
    });
    // this.rollNumber = 0;
    this.round = new Round(this);
    // make rolling button visible

    this.comb = new Array();
    this.comb.push(1, 2, 3, 4, 5, 6);
    this.comb.push("Three of a kind", "Four of a kind", "Full House", "Small Straight");
    this.comb.push("Large Straight", "Chance", "Yam");

    this.combList = new Array();
    this.combList.push("Ones", "Twos", "Threes", "Fours", "Fives", "Sixes");
    this.combList.push("Total", "Bonus", "Three of a kind", "Four of a kind");
    this.combList.push("Full House", "Small Straight", "Large Straight", "Chance");
    this.combList.push("Yam", "Total", "Grand Total");

    this.scoreTable = document.querySelector("table");
    this.createScoreCells();
  }

  rollButton() {
    if (this.round.rollNumber === 0) {
      this.round = new Round(this);
    }
    this.round.rollActiveDice();
    this.tempScores();

  }

  tempScores() {
    let scores = this.round.getScores();

    var controller = new AbortController();

    for (let i = 0; i < scores.length; ++i) {
      this.scoreCells[0][i].classList.remove("hide-zero"); // here: [0] => player's index
      if (!this.scoreCells[0][i].classList.contains("locked")) { // here: [0] => player's index
        if (scores[i] == 0) {
          this.scoreCells[0][i].classList.add("hide-zero"); // here: [0] => player's index
        }
        this.scoreCells[0][i].innerText = scores[i]; // here: [0] => player's index

        let thisGame = this;
        let thisCell = this.scoreCells[0][i];

        this.scoreCells[0][i].addEventListener("click", function() {
          thisGame.submitScore();
        });
      }
    }
  }

  eraseTempScores() {
    let scores = this.round.getScores();
    for (let i = 0; i < scores.length; ++i) {

      if (!this.scoreCells[0][i].classList.contains("locked")) { // here: [0] => player's index
        this.scoreCells[0][i].classList.remove("locked")
        this.scoreCells[0][i].innerText = ""; // here: [0] => player's index
      }
    }
  }

  createScoreCells() {
    this.generateTable();
    this.generateTableHead();

    this.scoreCells = new Array();
    for (let i = 0; i < this.numberOfPlayers; ++i) {
      this.scoreCells.push(document.querySelectorAll(".combination .p" + (i + 1)));
    }
  }

  generateTable() {
    for (let element of this.combList) {

      let row = this.scoreTable.insertRow();
      // define type of row and assign classes
      if (element.includes("Total") || element.includes("Bonus")) {
        row.classList.add("border-bottom", "border-2", "border-dark");
      } else {
        row.classList.add("combination", "number");
      }
      // add row title
      let th = document.createElement("th");
      let text = document.createTextNode(element);
      th.scope = "row";
      th.appendChild(text);
      row.appendChild(th);

      // add a cell for each column
      for (let i = 0; i < this.numberOfPlayers; ++i) {
        let cell = row.insertCell();
        cell.classList.add("p" + (i + 1));
      }
    }
  }

  generateTableHead() {
    let thead = this.scoreTable.createTHead();
    let row = thead.insertRow();
    let th = document.createElement("th");
    let text = document.createTextNode("Combinations");
    th.appendChild(text);
    th.scope = "col";
    row.appendChild(th);
    for (let i = 0; i < this.numberOfPlayers; ++i) {
      let th = document.createElement("th");
      let text = document.createTextNode("Player " + (i + 1));
      th.appendChild(text);
      th.scope = "col";
      row.appendChild(th);
    }
  }

  submitScore() {
    if (!event.target.classList.contains("locked")) {
      // change visual aspect to reflect locking of score
      event.target.classList.add("locked");
      // remove cell from list so that the score doesn't change
      event.target.classList.remove("hide-zero");
      this.eraseTempScores();
      this.round = new Round(this);
    }
  }



  //
  //   while (this.roundNumber < 13) {
  //     this.round = new Round();
  //
  //
  //     this.roundNumber++;
  //   }
  //
  //   next_round() {
  //     this.round = new Round();
  //     this.roundNumber = 0;
  //   }
  //
}



// const select = document.getElementById('player-number');
// let numberOfPlayers = select.options[select.selectedIndex].value;
// console.log("select " + select);
// console.log("numb " + numberOfPlayers);
let playerButton = document.getElementById('player-button');
playerButton.addEventListener("click", startNewGame);
// var game = new Game(numberOfPlayers);

function startNewGame() {
  let select = document.getElementById('player-number');
  let numberOfPlayers = select.options[select.selectedIndex].value;
  select.parentElement.style.display = "none";
  var game = new Game(numberOfPlayers);
}