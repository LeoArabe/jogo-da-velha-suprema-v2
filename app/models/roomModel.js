let rooms = {}; // Move isso para roomModel.js

exports.getRooms = () => rooms;
exports.setRooms = (newRooms) => { rooms = newRooms; };
exports.addPlayerToRoom = (roomId, player) => {
    if (!rooms[roomId]) {
        rooms[roomId] = { players: [player], moves: [] }; // Inicializa a sala se ela não existir
    }
    rooms[roomId].players.push(player); // Adiciona o jogador à lista de jogadores da sala
};
exports.addMoveToRoom = (movePlayer) => {
    rooms[id].moves.push(movePlayer);
}