const axios = require('axios');
const prisma = require('../config/db');

const API_URL = 'https://api.football-data.org/v4/';
const API_KEY = process.env.FOOTBALL_API_KEY;

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

const getGamesCompetition = async (competitionCode, fecha) => {
  try {
    let targetDate;
    
    if (fecha) {
      // Si recibe fecha se parsea (formato YYYY-MM-DD)
      const [year, month, day] = fecha.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    } else {
      // Si no recibe fecha se usa la fecha actual
      targetDate = new Date();
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const fullLeagueName = leagueNames[competitionCode.toUpperCase()];

    let matches = await prisma.match.findMany({
      where: {
        leagueName: fullLeagueName,
        matchDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: { matchDate: 'asc' }
    });

    if (matches.length === 0) {
      console.log(`No hay partidos en la DB para ${fullLeagueName} el día ${startOfDay.toISOString().slice(0,10)}.`);
    }
    return matches;

  } catch (error) {
    console.error("❌ Error en getGamesCompetition:", error.message);
    throw error;
  }
};

const getAvaibleLeagues = async() => {
  try {
    const response = await axios.get(`${API_URL}competitions`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error en getAvailableLeagues:", error.message);
    throw error;
  }
};

module.exports = { getGamesCompetition, getAvaibleLeagues };