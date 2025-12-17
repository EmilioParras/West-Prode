const axios = require('axios');
// const prisma = require('../config/db'); // De momento no lo usamos para ver el JSON

const API_URL = 'https://api.football-data.org/v4/competitions';
const API_KEY = process.env.FOOTBALL_API_KEY;

const syncMatches = async (competitionCode) => {
  try {
    console.log(`--- Consultando partidos de: ${competitionCode} ---`);

    // IMPORTANTE: Agregamos "/matches" al final para traer el fixture
    const response = await axios.get(`${API_URL}/${competitionCode}/matches`, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    return response.data;

  } catch (error) {
    console.error("❌ Error en syncMatches:");
    
    if (error.response) {
      return { 
        error: "Error de la API", 
        status: error.response.status, 
        detalle: error.response.data.message 
      };
    }
    return { error: error.message };
  }
};

module.exports = { syncMatches };