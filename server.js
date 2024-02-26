const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: `*`,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const corsOptions = require('./config/corsConfig');
const db = require('./db/database');
const routes = require('./app/routes/routes');
const indexRoutes = require('./app/routes/indexRoutes');
const setupSocket = require('./config/socketConfig');
const port = 21128;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

setupSocket(io);

app.use('/', indexRoutes);

server.listen(port, function () {
    console.log('Listening on port 21128');
});