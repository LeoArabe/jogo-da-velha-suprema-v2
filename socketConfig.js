const gameController = require('./gameController');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('joinGame', () => {
            let roomId;
            let playerSymbol;
            // Agora, sempre obtemos `rooms` diretamente de `gameController` para garantir consistência
            const rooms = gameController.getRooms();
            const playerName = gameController.getPlayersDetails().name || 'name fail';
            
            const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

            if (availableRoom) {
                roomId = availableRoom;
                // Atualiza `rooms` através de `gameController` após modificar
                gameController.addPlayerToRoom(roomId, { id: socket.id, symbol: 'o', name: playerName });
                playerSymbol = 'o';
            } else {
                roomId = Math.random().toString(36).substring(2, 7);
                // Cria uma nova sala e adiciona o jogador usando `gameController`
                gameController.createRoomWithPlayer(roomId, { id: socket.id, symbol: 'x', name: playerName });
                playerSymbol = 'x';
            }

            socket.join(roomId);
            socket.emit('joinedRoom', { roomId, symbol: playerSymbol, name: playerName });

            // Chamada atualizada para usar dados de `gameController`
            updateRoomPlayers(roomId);
        });

        socket.on('moveMade', ({ roomId, position, symbol }) => {
            // Atualiza os movimentos dentro de uma sala específica via `gameController`
            gameController.addMoveToRoom(roomId, { position, symbol });
            const moves = gameController.getRoomMoves(roomId);
            io.to(roomId).emit('gameUpdate', { moves });
        });

        socket.on('disconnect', () => {
            console.log('Um jogador saiu do jogo.');
        });
    });

    function updateRoomPlayers(roomId) {
        // Obtenha a sala atualizada diretamente de `gameController`
        const room = gameController.getRooms()[roomId];
        io.to(roomId).emit('updatePlayers', room.players);
    }
};
