const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const bodyParser = require('body-parser');
const port = 3333;
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://www.velhasuprema.kinghost.net', 'http://www.velhasuprema.kinghost.net/login/'];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};


app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/joinGame', (req, res) => {
    const playerName = req.body.name;
    console.log(playerName);
    res.status(200).send('Nome recebido');
})



// Corrigindo a configuraÃ§Ã£o para servir arquivos estÃ¡ticos
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Use res.sendFile para enviar o arquivo HTML
});

const rooms = {}; // Armazena as informaÃ§Ãµes das salas

io.on('connection', (socket) => {
    socket.on('joinGame', ({ name }) => {
        let roomId;
        let playerSymbol;

        // Encontrar uma sala disponÃ­vel ou criar uma nova
        const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

        if (availableRoom) {
            roomId = availableRoom;
            rooms[roomId].players.push({ id: socket.id, symbol: 'o', name });
            playerSymbol = 'o';
            console.log('voce Ã© O');
        } else {
            roomId = Math.random().toString(36).substring(2, 7); // Gera um ID de sala aleatÃ³rio
            rooms[roomId] = { players: [{ id: socket.id, symbol: 'x', name }], moves: [] };
            playerSymbol = 'x';
        }

        socket.join(roomId);
        socket.emit('joinedRoom', { roomId, symbol: playerSymbol, name });

        // Notificar todos na sala sobre o status atual
        updateRoomPlayers(roomId);
    });

    socket.on('moveMade', ({ roomId, position, symbol }) => {
        // Processar jogada, verificar vitÃ³ria/empate, etc.
        rooms[roomId].moves.push({ position, symbol });
        io.to(roomId).emit('gameUpdate', { moves: rooms[roomId].moves });
    });

    // Sair da sala
    socket.on('disconnect', () => {
        // Aqui vocÃª pode adicionar lÃ³gica para lidar com a desconexÃ£o de um jogador
        console.log('Um jogador saiu do jogo.');
    });
});

function updateRoomPlayers(roomId) {
    const room = rooms[roomId];
    io.to(roomId).emit('updatePlayers', room.players);
}

server.listen(21128, function(){
    console.log('Listening on port 21128');
});
