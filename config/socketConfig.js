const gameController = require('../app/controllers/gameController');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('joinGame', () => {
            const { playerName } = gameController.joinGame; // Supondo que o nome do jogador venha assim
            const { roomId, playerSymbol, rooms } = gameController.joinRoom(socket.id, playerName);
            
            socket.join(roomId);
            // Emite eventos ou atualizações necessárias para o cliente
            io.to(roomId).emit('joinedRoom', { roomId, symbol: playerSymbol, name: playerName, rooms });
            

            const updatedPlayers = gameController.updateRoomPlayers(roomId); // Supondo que essa função agora retorna a lista atualizada de jogadores
            io.to(roomId).emit('updatePlayers', updatedPlayers);
        });

        socket.on('moveMade', ({ roomId, position, symbol }) => {
            // Atualiza os movimentos dentro de uma sala específica via `gameController`
            gameController.addMoveToRoom(roomId, { position, symbol });
            const moves = gameController.getRoomMoves(roomId);
            io.to(roomId).emit('gameUpdate', { moves });
        });

        socket.on('disconnect', () => {
            // Você precisará determinar de qual sala o jogador está saindo
            // Isso pode ser feito mantendo um registro de qual jogador está em qual sala
            // gameController.handlePlayerDisconnect(socket.id);
            // Suponha que handlePlayerDisconnect atualize a sala automaticamente e devolva o id da sala afetada
            const roomId = gameController.getRoomIdByPlayer(socket.id);
            if (roomId) {
                io.to(roomId).emit('updatePlayers', gameController.updateRoomPlayers(roomId));
            }
            console.log('Um jogador saiu do jogo.');
        });
    });
};
