const express = require('express');
const router = express.Router(); 
const prisma = require('../config/db');
const { getGamesCompetition } = require('../services/footbalService');

// 1. RUTA DE SINCRONIZACIÓN (La que va a la API externa)
router.get('/sync/:code', async (req, res) => {
    const { code } = req.params;
    const result = await getGamesCompetition(code.toUpperCase());
    res.json(result);
});

// 2. RUTA DE LECTURA CON FILTRO (La que va a TU base de datos)
// URL: localhost:3000/partidos  (Trae todo)
// URL: localhost:3000/partidos?liga=Premier League (Trae solo Premier)
router.get('/', async (req, res) => {
    try {
        const { liga } = req.query; 
        
        const matches = await prisma.match.findMany({
            where: liga ? { leagueName: liga } : {}, 
            orderBy: { matchDate: 'asc' }
        });
        
        res.json(matches);
    } catch (error) {
        console.error("❌ Error al obtener partidos:", error.message);
        res.status(500).json({ error: "Error al obtener partidos" });
    }
});

module.exports = router;