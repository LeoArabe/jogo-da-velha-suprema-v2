let rooms = {}; // Move isso para roomModel.js

exports.getRooms = () => rooms;
exports.setRooms = (newRooms) => { rooms = newRooms; };
exports.addPlayerToRoom = (roomId, player) => {
    // Lógica para adicionar um jogador a uma sala
};
// Adicione mais funções conforme necessário para manipular 'rooms'
