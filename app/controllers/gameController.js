// gameController.js
const playerModel = require('./models/playerModel');
const roomModel = require('./models/roomModel');

exports.joinGame = (req, res) => {
    const playerName = req.body.name;
    // Chama o model para adicionar um jogador
    playerModel.addPlayer(playerName, (err, result) => {
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
};

exports.joinRoom = (socketId, playerName) => {
    // Primeiro, adicione o jogador (isso pode ser redundante se ele já foi adicionado via HTTP)
    playerModel.addPlayer(playerName, (err, result) => {
        // Trate os erros como necessário
        // ...

        // Agora, lide com a lógica da sala
        let roomId;
        let playerSymbol;
        const rooms = roomModel.getRooms();
        const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

        if (availableRoom) {
            roomId = availableRoom;
            playerSymbol = 'o'; // Por exemplo, defina o símbolo do jogador
        } else {
            roomId = Math.random().toString(36).substring(2, 7);
            playerSymbol = 'x'; // Defina o símbolo do jogador
            roomModel.createRoomWithPlayer(roomId, { id: socketId, symbol: playerSymbol, name: playerName });
        }

        // Finalmente, adicione o jogador à sala
        roomModel.addPlayerToRoom(roomId, { id: socketId, symbol: playerSymbol, name: playerName });

        // Retorna informações da sala e do jogador para serem usadas no socketConfig
        return { roomId, playerSymbol, rooms: roomModel.getRooms() };
    });
};

// Exemplo de função para atualizar a lista de jogadores em uma sala
exports.updateRoomPlayers = (roomId) => {
    const room = roomModel.getRooms()[roomId];
    // Retorna a lista atualizada de jogadores
    return room ? room.players : [];
};