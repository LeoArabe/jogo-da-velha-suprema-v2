let rooms = {}; // Move isso para roomModel.js

exports.getRooms = () => rooms;
exports.setRooms = (newRooms) => { rooms = newRooms; };
exports.createRoom = (roomId, player) => {
    rooms[roomId] = { players: [player], moves: [] };
}
exports.addPlayerToRoom = (roomId, player) => {
    rooms[roomId].players.push(player); // Adiciona o jogador à lista de jogadores da sala
};
exports.addMoveToRoom = (roomId, position) => {
    rooms[roomId].moves.push(position);
}