const gameController = require('../app/controllers/gameController');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('joinGame', () => {
            const { playerName } = gameController.joinGame; // Supondo que o nome do jogador venha assim
            // Dentro do evento 'joinGame' no seu servidor de socket
            socket.on('joinGame', () => {
                // Supondo que o nome do jogador seja obtido de alguma forma aqui
                const playerName = 'somePlayerName'; // Substitua isso pelo seu método de obter o nome do jogador

                gameController.joinRoom(socket.id, playerName)
                    .then(({ roomId, playerSymbol, rooms }) => {
                        socket.join(roomId);
                        // Emite eventos ou atualizações necessárias para o cliente
                        io.to(roomId).emit('joinedRoom', { roomId, symbol: playerSymbol, name: playerName, rooms });

                        const updatedPlayers = gameController.updateRoomPlayers(roomId); // Supondo que essa função agora retorna a lista atualizada de jogadores
                        io.to(roomId).emit('updatePlayers', updatedPlayers);
                    })
                    .catch(err => {
                        // Trate qualquer erro que possa ter ocorrido durante a tentativa de entrar na sala
                        console.error('Erro ao entrar na sala:', err);
                        // Envie uma mensagem de erro ao cliente, se necessário
                        socket.emit('errorJoiningRoom', { message: 'Erro ao entrar na sala.' });
                    });
            });

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
            //const roomId = gameController.getRoomIdByPlayer(socket.id);
            gameController.joinRoom(socket.id, playerName)
                .then(({ roomId, playerSymbol, rooms }) => {
                    if (roomId) {
                        io.to(roomId).emit('updatePlayers', gameController.updateRoomPlayers(roomId));
                    }
                })

            console.log('Um jogador saiu do jogo.');
        });
    });
};
