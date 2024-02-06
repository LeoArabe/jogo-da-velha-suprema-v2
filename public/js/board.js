test
export const boardElements = document.querySelectorAll("[data-board]");
export const elementInfoPlayer = document.getElementById("info-player");
export const elementInfoGame = document.getElementById("info-game");
export const cellElements = document.querySelectorAll("[data-cell]");
export const joinGameButton = document.querySelector(
  "[data-joingame-button]"
);

export const elementInfoGameEnable = () => {
  elementInfoGame.classList.add('has-content');
}

export const elementInfoGameDisable = () => {
elementInfoGame.classList.remove('has-content');
elementInfoGame.innerText = ''
}

export const marcaBoardW = (index, hw) => {
  boardElements[index].classList.add(hw);
};

export const marcaBoardD = (index) => {
  boardElements[index].classList.add("d");
};

export const setBoardHoverClass = () => {

  for (let index = 0; index < boardElements.length; index++) {
    boardElements[index].classList.remove('o');
    boardElements[index].classList.remove('x');

    if (currentPlayerSymbol !== 'x') {
      boardElements[index].classList.add('o');
    } else {
      boardElements[index].classList.add('x');
    }
  };

};

export const removeBoardHoverClass = () => {

  for (let index = 0; index < boardElements.length; index++) {
      boardElements[index].classList.remove('o');
      boardElements[index].classList.remove('x');
      boardElements[index].classList.remove('u');
  }
}

export const setBoardUnlockedHover = (boardUnlock) => {
  for (let index = 0; index < boardElements.length; index++) {
      boardElements[index].classList.remove('u');
      if (boardUnlock > 8) {
          boardElements[index].classList.add('u');
      } else {
          boardElements[boardUnlock].classList.add('u');
          break;
      }
  }
}