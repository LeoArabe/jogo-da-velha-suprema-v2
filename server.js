const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const port = 21128;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: `*`,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  

const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin); // Útil para debug
        const allowedOrigins = [
            'http://www.velhasuprema.kinghost.net',
            'http://www.velhasuprema.kinghost.net:21128',
            'http://www.velhasuprema.kinghost.net:21128/joinGame' 
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Permite a requisição se a origem estiver na lista
        } else {
            callback(new Error(`This: ${origin} Not allowed by CORS`), false); // Bloqueia a requisição
        }
    },
};

const db = mysql.createConnection({
    host:'mysql.velhasuprema.kinghost.net',
    user: 'velhasuprema',
    password: 'Leandrotwd1',
    database: 'velhasuprema',
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL');
});


app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/joinGame', (req, res) => {
    const playerName = req.body.name;

    let sql = 'INSERT IGNORE INTO Jogadores (Player Name) VALUES (?)';
    let values = [playerName];

    db.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows === 0) {
            console.log('Nome do jogador já existe, inserção ignorada.');
        } else {
            console.log('Nome do jogador salvo no banco de dados');
        }
        res.send('Operação concluída');
    });
    
    playersDetails.name = playerName;
    res.status(200).send('Nome recebido');
})

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    const playerName = req.cookies.playerName;
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const rooms = {}; // Armazena as informaÃ§Ãµes das salas
let playersDetails = {};

io.on('connection', (socket) => {
    socket.on('joinGame', () => {
        let roomId;
        let playerSymbol;
        const playerName = playersDetails.name || 'name fail';
        // Encontrar uma sala disponÃ­vel ou criar uma nova
        const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

        if (availableRoom) {
            roomId = availableRoom;
            rooms[roomId].players.push({ id: socket.id, symbol: 'o', name: playerName });
            playerSymbol = 'o';
            console.log('voce Ã© O');
        } else {
            roomId = Math.random().toString(36).substring(2, 7); // Gera um ID de sala aleatÃ³rio
            rooms[roomId] = { players: [{ id: socket.id, symbol: 'x', name: playerName }], moves: [] };
            playerSymbol = 'x';
        }

        socket.join(roomId);
        socket.emit('joinedRoom', { roomId, symbol: playerSymbol, name: playerName });

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

server.listen(port, function(){
    console.log('Listening on port 21128');
});