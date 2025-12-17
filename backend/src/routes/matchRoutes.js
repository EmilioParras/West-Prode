const express = require('express');
const router = express.Router();    
const { syncMatches } = require('../services/footbalService');

router.get('/sync/:code', async (req, res) => {
    const { code } = req.params; // Ejemplo: 'PL' o 'PD'
    const result = await syncMatches(code.toUpperCase());
    res.json(result);
});

module.exports = router;  