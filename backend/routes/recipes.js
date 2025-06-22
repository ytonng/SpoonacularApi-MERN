const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  searchRecipes,
  findByIngredients,
  randomRecipes,
  getRecipeDetail,
  saveRecipe,
  getSavedRecipes,
  removeSavedRecipe,
} = require('../controllers/recipeController');

router.get('/search', auth, searchRecipes);
router.get('/by-ingredients', auth, findByIngredients);
router.get('/by-random', auth, randomRecipes);
router.get('/saved', auth, getSavedRecipes);
router.get('/:id', auth, getRecipeDetail);
router.post('/save', auth, saveRecipe);
router.post('/remove', auth, removeSavedRecipe);

module.exports = router;
