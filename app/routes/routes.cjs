const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController.cjs');

router.post('/joinGame', gameController.joinGame);

module.exports = router;
