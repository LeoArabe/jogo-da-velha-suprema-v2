// gameController.js
const playerModel = require('../models/playerModel.cjs');
const roomModel = require('../models/roomModel.cjs');

let playerName; 

exports.joinGame = (req, res) => {
    const reqPlayerName = req.body.name;
    console.log(`reqplayername: ${reqPlayerName}`)
    console.log(`reqbody: ${req.body}`)
    // Chama o model para adicionar um jogador
    playerModel.addPlayer(reqPlayerName, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao processar a requisição');
        }

        if (result.affectedRows === 0) {
            console.log('Nome do jogador já existe, inserção ignorada.');
        } else {
            console.log('Nome do jogador salvo no banco de dados');
        }
        res.status(200).send('Operação concluída');
    });
    playerName = reqPlayerName;
};

exports.joinRoom = (socketId) => {
    return new Promise((resolve, reject) => {
            let roomId;
            let playerSymbol;
            const rooms = roomModel.getRooms();
            const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

            if (availableRoom) {
                roomId = availableRoom;
                playerSymbol = 'o'; // Por exemplo, defina o símbolo do jogador            
                roomModel.addPlayerToRoom(roomId, { id: socketId, symbol: playerSymbol, name: playerName });

            } else {
                roomId = Math.random().toString(36).substring(2, 7);
                playerSymbol = 'x'; // Defina o símbolo do jogador
                roomModel.createRoom(roomId, { id: socketId, symbol: playerSymbol, name: playerName });
            }

            resolve({ roomId, playerSymbol, playerName, rooms }); // Resolve a Promise com os resultados
        });
};

// Exemplo de função para atualizar a lista de jogadores em uma sala
exports.updateRoomPlayers = (roomId) => {
    const room = roomModel.getRooms()[roomId];
    return room ? room.players : [];
};