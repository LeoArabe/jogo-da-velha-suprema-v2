const gameController = require('./gameController');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('joinGame', () => {
            let roomId;
            let playerSymbol;
            const rooms = gameController.getRooms();
            const playerName = gameController.getPlayersDetails().name || 'name fail';
            // Encontrar uma sala disponÃ­vel ou criar uma nova
            const availableRoom = Object.keys(rooms).find(roomId => rooms[roomId].players.length < 2);

            if (availableRoom) {
                roomId = availableRoom;
                rooms[roomId].players.push({ id: socket.id, symbol: 'o', name: playerName });
                playerSymbol = 'o';
                console.log('voce é O');
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
    };
};
