const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: Number }], // Spoonacular recipe IDs
});

module.exports = mongoose.model('User', UserSchema);
