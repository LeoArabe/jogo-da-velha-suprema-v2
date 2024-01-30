    export const boardElements = document.querySelectorAll("[data-board]");
    export const textVez = document.getElementById("vez");
    export const cellElements = document.querySelectorAll("[data-cell]");

    export const marcaBoardW = (index, hw) => {
  boardElements[index].classList.add(hw);
};

    export const marcaBoardD = (index) => {
  boardElements[index].classList.add("d");
};

    export const setBoardHoverClass = (circleTurn) => {
  for (let index = 0; index < boardElements.length; index++) {
    boardElements[index].classList.remove("o");
    boardElements[index].classList.remove("x");
    if (circleTurn) {
      boardElements[index].classList.add("o");
    } else {
      boardElements[index].classList.add("x");
    }
  }
};

