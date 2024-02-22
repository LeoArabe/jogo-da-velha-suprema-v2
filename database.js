const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'mysql.velhasuprema.kinghost.net',
    user: 'velhasuprema',
    password: 'Leandrotwd1',
    database: 'velhasuprema',
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

module.exports = db;