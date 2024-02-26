const express = require('express');
const router = express.Router();
const gameController = require('../../app/controllers/gameController');

router.post('/joinGame', gameController.joinGame);

module.exports = router;
