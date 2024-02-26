const express = require('express');
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
    // Supondo que você ainda precise acessar `playerName` de algum lugar
    const playerName = req.cookies ? req.cookies.playerName : 'Guest';
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

module.exports = router;
