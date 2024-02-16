import { circleTurn } from "./script.js";
    export const trocaVez = (vez) => {
        return !vez;
  };
  
    export const suaVez = () => {
        return true;
  };

  export const changeTurn = () => {
    turn = !turn;
}
  
export const swapTurns = () => {
  circleTurn = !circleTurn;
};