const express = require('express');
const router = express.Router();
const gameController = require('./gameController');

router.post('/joinGame', gameController.joinGame);

module.exports = router;
