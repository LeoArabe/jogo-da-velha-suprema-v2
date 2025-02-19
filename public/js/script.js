import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

import {
    setBoardHoverClass, setBoardUnlockedHover, removeBoardHoverClass,
    elementInfoPlayer, elementInfoGame, boardElements, cellElements,
    joinGameButton, elementInfoGameEnable, elementInfoGameDisable
} from "./board.js";
import { changeTurn } from "./players.js";
import { checkAll, circleTurn } from "./rules.js";
import { winningMessage, restartButton, limparButton } from "./page.js";

//Váriaveis Globais
const socket = io()

const tipsToPlay = [
    "Mire em células que dificultem a estratégia do adversário, redirecionando-o para tabuleiros menos vantajosos.",
    "Jogar no centro pode ser estratégico, controle o tabuleiro central para mais opções.",
    "Evite enviar o adversário para um tabuleiro onde ele possa ganhar facilmente.",
    "Escolha células que não só bloqueiem o adversário, mas também criem oportunidades para você.",
    "Antecipe os movimentos do adversário e planeje seus para mantê-lo na defensiva.",
    "Use sua jogada para configurar futuras vitórias, pensando dois passos à frente.",
    "Vencer um tabuleiro central oferece controle estratégico; direcione suas jogadas para lá.",
    "Bloqueie o adversário, mas mantenha o foco em completar seus próprios 3 em linha.",
    "Considere o impacto a longo prazo de cada jogada, visando tabuleiros com menos opções para o adversário.",
    "Priorize tabuleiros onde você já tem vantagem, forçando o adversário a jogar defensivamente.",
    "Lembre-se, ganhar três tabuleiros alinhados é o objetivo; planeje suas jogadas com isso em mente.",
    "Analise os tabuleiros ativamente; escolha jogadas que abram múltiplas possibilidades de vitória.",
    "Mantenha o equilíbrio entre atacar e defender; cada jogada pode redirecionar o fluxo do jogo.",
    "Aproveite ao máximo as jogadas que pressionam o adversário em vários tabuleiros simultaneamente.",
    "Seja flexível; adapte sua estratégia conforme o jogo evolui e novas oportunidades surgem."
]
const celle0 = [[0, 1, 2, 3, 4, 5, 6, 7, 8]
];

let currentPlayerName;
let currentRoomId;
let firstPlayer;
let secondPlayer;
export let currentPlayerSymbol;
export let turn;
let numberMove = 0;
let classToAdd;
let boardUnlock;

socket.emit('joinGame',);

socket.on('joinedRoom', ({ roomId, symbol, name, rooms }) => {
    currentRoomId = roomId;
    currentPlayerSymbol = symbol;
    currentPlayerName = name;
    console.log(rooms);
    console.log(`current room: ${roomId}`);
    console.log(`name: ${name}`);
    elementInfoPlayer.innerText = "Aguardando um adversário...";
});

socket.on('updatePlayers', (players) => {
    firstPlayer = players[0];
    secondPlayer = players[1];
    // Atualizar a interface com a lista de jogadores
    if (players.length === 2) {
        if (currentPlayerSymbol === 'x') {
            turn = true;
            setBoardUnlocked(9);
            setBoardHoverClass();
            setBoardUnlockedHover(boardUnlock);            
            elementInfoGameEnable();
            elementInfoPlayer.innerText = `"Sua vez, ${firstPlayer.name}!"`;
            elementInfoGame.innerText = `Você começa! jogue onde quiser!`;
        } else {
            elementInfoPlayer.innerText = `"Aguarde sua vez, ${secondPlayer.name}!"`; 
        }
    } 
});

socket.on('gameUpdate', (gameState) => {
    console.log(gameState);
    //define coordenadas para marcar posição 
    let cella = gameState.moves[numberMove].position.cella;
    let cellb = gameState.moves[numberMove].position.cellb;
    //define quem fez a ação e marca em seguida
    classToAdd = gameState.moves[numberMove].symbol;
    console.log(`cella: ${cella} e cellb: ${cellb} depois de testar undefined`);
    boardElements[cellb].children[cella].classList.add(classToAdd);
    //desbloqueia onde proximo jogador podera jogar
    setBoardUnlocked(parseInt(cella));
    checkAll(classToAdd);
    if (boardElements[cella].classList[2] == "wx" || boardElements[cella].classList[2] == "wo") {
        setBoardUnlocked(9);
    }
    console.log(turn)
    turn = changeTurn(turn);
    console.log(turn)
    console.log(circleTurn)
    //altera texto para avisar de quem é o turno
    if (turn) {
        elementInfoGameEnable();
        elementInfoPlayer.innerText = `"Sua vez, ${currentPlayerName}!"`;
        console.log()
        const randomTipsNumber = Math.floor(Math.random() * 15);
        elementInfoGame.innerText = tipsToPlay[randomTipsNumber]
        setBoardHoverClass();
        setBoardUnlockedHover(boardUnlock);
    } else {
        elementInfoPlayer.innerText = `"Aguarde sua vez, ${currentPlayerName}!"`;
        removeBoardHoverClass();
        elementInfoGameDisable();
    }
    console.log(`esse é o novo boardUnlock ${boardUnlock}`)
    numberMove++
});

socket.on('restart', function (text) {
    console.log(text)
})

const setBoardUnlocked = (value) => {
    boardUnlock = value;
}

function click() {
    for (const cell of cellElements) {
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    }
};

function removeCellAll(cell1, index,) {
    for (var index; index < cell1; index++) {
        cellElements[index].classList.remove("x", "o");
        cellElements[index].classList.add("cell");
    }
    for (let index = 0; index < 9; index++) {
        boardElements[index].classList.remove("wx", "wo", "d");
    }
};

const startGame = () => {
    circleTurn;
    click();
    removeCellAll(81, 0);
    winningMessage.classList.remove("show-winning-message");
    elementInfoPlayer.innerText = "Insira o seu nome, e bom jogo!!"
};

const handleClick = (e) => {
    if (!turn) return;
    let cell = e.target;
    let cella = parseInt(cell.classList[1]);
    let cellb = parseInt(cell.parentNode.classList[1]);
    if (boardUnlock === 9 || boardUnlock === cellb) {
        if (cell.classList.contains("x") || cell.classList.contains("o")) {
            console.log("Célula já ocupada.");
            return;
        }
        const data = { cella, cellb };
        socket.emit('moveMade', { roomId: currentRoomId, position: data, symbol: currentPlayerSymbol });
    } else {
        console.log("Movimento não permitido.");
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
//joinGameButton.addEventListener("click", joinGame);