const express = require('express');
const router = express.Router(); 
const prisma = require('../config/db');
const { syncMatches } = require('../services/footbalService');

// DICCIONARIO DE CÓDIGOS A NOMBRES
const leagueNames = {
    'PL': 'Premier League',
    'PD': 'Primera Division',
    'SA': 'Serie A',
    'BL1': 'Bundesliga',
    'CL': 'UEFA Champions League'
};

// NUEVA RUTA: GET /partidos/:code (Ej: /partidos/PL)
router.get('/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const fullLeagueName = leagueNames[code];

        if (!fullLeagueName) {
            return res.status(404).json({ error: "Código de liga no soportado o inválido." });
        }

        // 1. Intentamos buscar los partidos en NUESTRA base de datos primero
        let matches = await prisma.match.findMany({
            where: { leagueName: fullLeagueName },
            orderBy: { matchDate: 'asc' }
        });

        // 2. Si NO hay partidos en la DB, los sincronizamos automáticamente
        if (matches.length === 0) {
            console.log(`Buscando datos nuevos para ${fullLeagueName}...`);
            await syncMatches(code);
            
            // Volvemos a consultar la DB ahora que ya están guardados
            matches = await prisma.match.findMany({
                where: { leagueName: fullLeagueName },
                orderBy: { matchDate: 'asc' }
            });
        }

        res.json(matches);

    } catch (error) {
        console.error("❌ Error en la ruta de partidos:", error.message);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

module.exports = router;