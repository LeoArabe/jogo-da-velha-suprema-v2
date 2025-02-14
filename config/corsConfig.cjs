const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin); // Útil para debug
        const allowedOrigins = [
            'http://www.velhasuprema.kinghost.net',
            'http://www.velhasuprema.kinghost.net:21041',
            'http://www.velhasuprema.kinghost.net:21041/joinGame',
            'http://localhost:3000'
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Permite a requisição se a origem estiver na lista
        } else {
            callback(new Error(`This: ${origin} Not allowed by CORS`), false); // Bloqueia a requisição
        }
    },
};

module.exports = corsOptions;