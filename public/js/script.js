import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

// Import board related functions and variables
import { boardElements, setBoardHoverClass, textVez, cellElements} from "./board.js";

// Import players related functions
import { trocaVez, suaVez } from "./players.js";

// Import rules related functions and variables
import { checkAll, placeMark } from "./rules.js";

// Import rules related functions and variables
import { winningMessage, restartButton, limparButton } from "./page.js";


//Váriaveis Globais
const socket = io()

const celle0 = [[0,1,2,3,4,5,6,7,8]
];

export let circleTurn;
let boardUnlock = 9;
let vez;

//Funções

function click () {

    for (const cell of cellElements) {

            cell.removeEventListener("click", handleClick);
            cell.addEventListener("click", handleClick, {once: true});
        }
    
   
};

function removeCellAll (cell1, index,) {
  
    for (var index; index < cell1 ; index++) {
        cellElements[index].classList.remove("x", "o");
        cellElements[index].classList.add("cell");
    }
    for (let index = 0; index < 9 ; index++) {
        boardElements[index].classList.remove("wx","wo","d");
        
        
    }
    

};

const startGame = () => {

    vez=true;
    circleTurn = false;
    click();
    removeCellAll(81,0);
        
    setBoardHoverClass();
    winningMessage.classList.remove("show-winning-message");
    textVez.innerText = "Clique para começar!!"

};

socket.on('restart', function(text) {

    console.log(text)

})

socket.on('marca', function(data) {
    textVez.innerText = "Sua Vez!"
    if(data.ncella === undefined){
        data.ncella = data.ncellb;
    }
    const classToAdd = circleTurn ? "o" : "x";
    boardElements[data.ncellb].children[data.ncella].classList.add(classToAdd);
    boardUnlock = data.ncella
    if(boardElements[data.ncella].classList[1] == "wx" || boardElements[data.ncella].classList[1] == "wo"){
        boardUnlock=9;
    }
    console.log(boardUnlock)
    
    checkAll(classToAdd);
    suaVez();
    
    
})

const handleClick = (e) => {
if(vez){
    const cell = e.target;
    const classToAdd = circleTurn ? "o" : "x";
    
    let cella = e.target.classList[2]
    let cellb = e.target.classList[1]
    
    
    console.log(boardUnlock)

    if(boardUnlock == 9 || boardUnlock == cellb || boardUnlock == 9 && boardUnlock == cellb ){

        textVez.innerText = "Espere Sua vez"
        placeMark(cell, classToAdd);
        const data = {
            ncella: cella,
            ncellb: cellb,
        } 

        socket.emit('click', (data));
        checkAll(classToAdd);
        trocaVez();
    
    }
    
}
};
 
startGame();

const limparJogo = () => {
  socket.emit('reinicia');
}

socket.on('reiniciou', () => {
    startGame();
  });

limparButton.addEventListener("click", limparJogo);
restartButton.addEventListener("click", limparJogo);
