import { boardElements, marcaBoardW, marcaBoardD, cellElements } from "./board.js";
import { swapTurns } from "./players.js";
import { circleTurn } from "./script.js";
import { winningMessage, winningMessageTextElement } from "./page.js";

let hw;

  export const celle0 = [[0,1,2,3,4,5,6,7,8]
];

  export const winningCombinationsClass0 = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
  [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];

  export function removeCell (cell1, index,) {
  
  for (var index; index < cell1 ; index++) {
      cellElements[index].classList.remove("cell" , "x", "o");
  }

};
  export const checkForWin0 = (currentPlayer,board) => {
    return winningCombinationsClass0.some((combination) => {
        return combination.every((index) => {
            return boardElements[board].children[index].classList.contains(currentPlayer);
        });
    });
};

  export const checkForWinner = (classToEnd) => {

    return winningCombinationsClass0.some((combination) => {
        return combination.every((index) => {
            return boardElements[index].classList.contains(classToEnd) ;
            
        });
    });
};

  export const checkForDraw = () => {
    
    return celle0.some((combination) => {
        return combination.every((index) => {
            return boardElements[index].classList.contains("d") ||
                    boardElements[index].classList.contains("wo") ||
                     boardElements[index].classList.contains("wx");
        });
    });  
};

  export const checkForDraw0 = (celle,board) => {
    
    return celle.some((combination) => {
        return combination.every((index) => {
            return boardElements[board].children[index].classList.contains("x") || 
            boardElements[board].children[index].classList.contains("o");
        });
    });  
};

  export const endGame = (draw, end) => {
       
  hw = circleTurn 
 ? "wo" 
 : "wx"
 
if(draw){
 winningMessage.classList.add("show-winning-message");
 winningMessageTextElement.innerText = "Empate!";
}
if(end) {
  winningMessage.classList.add("show-winning-message");
 winningMessageTextElement.innerText = circleTurn
? "O Venceu!"
: "X Venceu!";

}

};

  export const endGame0 = (draw,index,x,y) => {
if(draw){
 removeCell(x,y);
 marcaBoardD(index);
}else{
 endGame(draw);
 marcaBoardW(index, hw);
 removeCell(x,y);
  
}
};

  export function test0 (isWin ,draw , board) {
   
  if (isWin) {
      qualClasseFechou(false, board);  
  }else if (draw) {
      qualClasseFechou(true, board);
  }
};

  export function qualClasseFechou (seFalso, board) {
   
  var y = board*9
  var x = board*9+9

 if(seFalso==false){
      endGame0(seFalso, board, x, y);
  }else if(seFalso){
      endGame0(seFalso, board, x, y)
  }
};

  export const checkAll = (classToAdd) => {
  const cadaJogoW = [];
  const cadaJogoD = [];

  for (let i = 0; i < 9; i++) {
    cadaJogoW.push(checkForWin0(classToAdd, i));
    cadaJogoD.push(checkForDraw0(celle0, i));
  }

  for (let i = 0; i < cadaJogoW.length; i++) {
    switch (true) {
      case cadaJogoW[i]:
        test0(cadaJogoW[i], cadaJogoD[i], i);
        break;
      case cadaJogoD[i]:
        test0(cadaJogoW[i], cadaJogoD[i], i);
        break;
      default:
        break;
    }
  }

  const classToEnd = circleTurn ? "wo" : "wx";
  const draw = checkForDraw();
  const winner = checkForWinner(classToEnd);

  if (winner) {
    endGame(false, true);
  } else if (draw) {
    endGame(true, false);
  } else {
    circleTurn = swapTurns(circleTurn);
  }
};