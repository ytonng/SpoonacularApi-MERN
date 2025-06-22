const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  quantityType: { type: String, default: 'piece' },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);