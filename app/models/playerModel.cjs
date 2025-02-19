// db/database.js é o módulo que configura e fornece a conexão com o banco de dados
const db = require('../../db/database.cjs');

// playerModel.js
exports.addPlayer = (playerName, callback) => {
    console.log(`playername in db ${playerName}`);
    //Verificação de Login
    const checkSql = 'SELECT * FROM Jogadores WHERE player_name = ?';
    db.query(checkSql, [playerName], function (err, results) {
        if (err) return callback(err, null);

        if (results.lenght > 0) {
            console.log('Jogador já existe no DB');
            return callback(null, { playerExists: true, playerName: results[0].player_name });
        }

        const sql = 'INSERT INTO Jogadores (player_name) VALUES (?)';
        db.query(insertSql, [playerName], function (err, result) {
            if (err) return callback(err, null);
            callback(null, { afterRows: result.affectedRows, playerName });
        });
    });
};
