// db/database.js é o módulo que configura e fornece a conexão com o banco de dados
const db = require('../../db/database');

// playerModel.js
exports.addPlayer = (playerName, callback) => {
    const sql = 'INSERT IGNORE INTO Jogadores (player_name) VALUES (?)';
    db.query(sql, [playerName], function(err, result) {
        callback(err, result);
    });
};
