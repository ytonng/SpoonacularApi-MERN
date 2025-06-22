console.log('recipeController loaded');

const spoonacular = require('../utils/spoonacular');
const InventoryItem = require('../models/InventoryItem');
const User = require('../models/User');

exports.searchRecipes = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ msg: 'Query parameter is required.' });
  }
  try {
    const response = await spoonacular.get('/recipes/complexSearch', {
      params: {
        query,
        number: 12,
        addRecipeInformation: true,
      },
    });
    return res.json(response.data.results);
  } catch (err) {
    return res.status(500).json({ msg: 'Spoonacular error' });
  }
};

exports.randomRecipes = async (req, res) => {
    try {
      const response = await spoonacular.get('/recipes/random', {
        params: { number: 9 },
      });
      return res.json(response.data.recipes);
    } catch (err) {
      return res.status(500).json({ msg: 'Spoonacular error' });
    }
};

exports.findByIngredients = async (req, res) => {
  // Get user's inventory
  const inventory = await InventoryItem.find({ user: req.user.user.id });
  if (inventory.length === 0) {
    // If inventory is empty, return random recipes
    try {
      const response = await spoonacular.get('/recipes/random', {
        params: { number: 4 },
      });
      return res.json(response.data.recipes);
    } catch (err) {
      return res.status(500).json({ msg: 'Spoonacular error' });
    }
  }
  const ingredients = inventory.map(item => item.name).join(',');
  try {
    // Find recipes by ingredients
    const response = await spoonacular.get('/recipes/findByIngredients', {
      params: { ingredients, number: 20, ranking: 1 },
    });
    // Add match score (how many ingredients user has)
    const recipes = response.data.map(recipe => ({
      ...recipe,
      matchScore: recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount),
    }));
    // Sort by matchScore descending
    recipes.sort((a, b) => b.matchScore - a.matchScore);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ msg: 'Spoonacular error' });
  }
};

exports.getRecipeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await spoonacular.get(`/recipes/${id}/information`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ msg: 'Spoonacular error' });
  }
};

// Saved recipes
exports.saveRecipe = async (req, res) => {
  const { recipeId } = req.body;
  const user = await User.findById(req.user.user.id);
  if (!user.savedRecipes.includes(recipeId)) user.savedRecipes.push(recipeId);
  await user.save();
  res.json(user.savedRecipes);
};

exports.getSavedRecipes = async (req, res) => {
  console.log('getSavedRecipes called');
  try {
    const userId = req.user.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!user.savedRecipes || user.savedRecipes.length === 0) return res.json([]);

    // Accept both string and number IDs
    const validRecipeIds = user.savedRecipes.filter(id => id && !isNaN(Number(id)));
    if (validRecipeIds.length === 0) return res.json([]);

    const recipeIds = validRecipeIds.map(id => Number(id)).join(',');
    if (!recipeIds) return res.json([]);

    // Debug log
    console.log('Fetching recipes for IDs:', recipeIds);

    const response = await spoonacular.get('/recipes/informationBulk', {
      params: { ids: recipeIds }
    });

    return res.json(response.data);
  } catch (err) {
    console.error('Error fetching saved recipes:', err?.response?.data || err);
    console.error('Full error object:', err);
    return res.status(500).json({ msg: 'Server error fetching saved recipes' });
  }
};

exports.removeSavedRecipe = async (req, res) => {
  const { recipeId } = req.body;
  const user = await User.findById(req.user.user.id);
  user.savedRecipes = user.savedRecipes.filter(id => id !== recipeId);
  await user.save();
  res.json(user.savedRecipes);
};

