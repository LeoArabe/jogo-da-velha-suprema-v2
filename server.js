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
const corsOptions = require('./corsConfig');
const db = require('./database');
const routes = require('./routes');
const indexRoutes = require('./indexRoutes');
const setupSocket = require('./socketConfig');

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

setupSocket(io);

app.use('/', indexRoutes);

server.listen(port, function () {
    console.log('Listening on port 21128');
});