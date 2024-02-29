// gameController.js
const playerModel = require('../models/playerModel');
const roomModel = require('../models/roomModel');

let playerName; 

exports.joinGame = (req, res) => {
    const reqPlayerName = req.body.name;
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

            // Finalmente, adicione o jogador à sala

            // Retorna informações da sala e do jogador para serem usadas no socketConfig
            console.log(`teste esse e o room id: ${roomId}`)
            resolve({ roomId, playerSymbol, playerName, rooms: roomModel.getRooms() }); // Resolve a Promise com os resultados
        });
    
};

// Exemplo de função para atualizar a lista de jogadores em uma sala
exports.updateRoomPlayers = (roomId) => {
    const room = roomModel.getRooms()[roomId];
    // Retorna a lista atualizada de jogadores
    return room ? room.players : [];
};