const express = require('express');
const router = express.Router(); 
const prisma = require('../config/db');
const { getGamesCompetition } = require('../services/footballService');
const { getAvaibleLeagues } = require('../services/footballService');

// DICCIONARIO DE CÓDIGOS A NOMBRES
const leagueNames = {
    'WC': 'Fifa World Cup',
    'CL': 'UEFA Champions League',
    'BL1': 'Bundesliga',
    'DED': 'Eredivisie',
    'BSA': 'Campeonato Brasileiro Serie A',
    'PD': 'Primera Division',
    'FL1': 'Ligue 1',
    'ELC': 'Championship',
    'PPL': 'Primeira Liga',
    'EC': 'European Championship',
    'SA': 'Serie A',
    'PL': 'Premier League'
};

// RUTA: GET /api/competitions (Trae las ligas disponibles en la API con el plan FREE)
router.get('/competitions', async (req, res) => {
    try {
        const data = await getAvaibleLeagues();
        res.json(data);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'No se pudieron obtener las ligas' });
    }
});

// RUTA: GET /fixture/:code (Ej: /fixture/PL)
router.get('/fixture/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const { fecha } = req.query;

        if (!leagueNames[code]) {
            return res.status(404).json({ error: "Código de liga no soportado o inválido." });
        }

        const matches = await getGamesCompetition(code, fecha);
        res.json(matches);

    } catch (error) {
        console.error("❌ Error en la ruta de partidos:", error.message);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

module.exports = router;