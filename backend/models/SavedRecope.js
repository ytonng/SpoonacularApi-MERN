const mongoose = require('mongoose');

const SavedRecipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: Number, required: true }, // Spoonacular recipe ID
  title: String,
  image: String,
  // Add more fields as needed from Spoonacular
});

module.exports = mongoose.model('SavedRecipe', SavedRecipeSchema);
