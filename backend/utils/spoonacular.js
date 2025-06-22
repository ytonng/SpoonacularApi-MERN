const axios = require('axios');
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com',
  params: { apiKey: SPOONACULAR_API_KEY },
});

module.exports = spoonacular;