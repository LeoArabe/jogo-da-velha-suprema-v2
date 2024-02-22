const db = require('./database');

let rooms = {}; // Armazena as informações das salas
let playersDetails = {}; // Detalhes dos jogadores

// Função para adicionar jogador ao banco de dados
exports.joinGame = (req, res) => {
    const playerName = req.body.name;
    playersDetails.name = playerName; // Atualiza os detalhes do jogador

    let sql = 'INSERT IGNORE INTO Jogadores (player_name) VALUES (?)';
    let values = [playerName];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao processar a requisição');
        }

        console.log(result);
        if (result.affectedRows === 0) {
            console.log('Nome do jogador já existe, inserção ignorada.');
        } else {
            console.log('Nome do jogador salvo no banco de dados');
        }

        res.status(200).send('Operação concluída');
    });
};

// Funções para manipular as salas e os detalhes dos jogadores
exports.getRooms = () => rooms;
exports.setRooms = (newRooms) => { rooms = newRooms; };

exports.getPlayersDetails = () => playersDetails;
exports.setPlayersDetails = (newDetails) => { playersDetails = newDetails; };

// Adiciona um jogador a uma sala específica
exports.addPlayerToRoom = (roomId, player) => {
    if (!rooms[roomId]) {
        rooms[roomId] = { players: [], moves: [] };
    }
    rooms[roomId].players.push(player);
};

// Cria uma nova sala com um jogador
exports.createRoomWithPlayer = (roomId, player) => {
    rooms[roomId] = { players: [player], moves: [] };
};

// Adiciona um movimento a uma sala
exports.addMoveToRoom = (roomId, move) => {
    if (rooms[roomId]) {
        rooms[roomId].moves.push(move);
    }
};

// Obtém os movimentos de uma sala
exports.getRoomMoves = (roomId) => {
    if (rooms[roomId]) {
        return rooms[roomId].moves;
    }
    return [];
};