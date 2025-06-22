const InventoryItem = require('../models/InventoryItem');

exports.getInventory = async (req, res) => {
  const items = await InventoryItem.find({ user: req.user.user.id });
  res.json(items);
};

exports.addItem = async (req, res) => {
  const { name, quantity, quantityType, expiryDate } = req.body;
  const item = new InventoryItem({
    user: req.user.user.id,
    name,
    quantity,
    quantityType,
    expiryDate
  });
  await item.save();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await InventoryItem.deleteOne({ _id: req.params.id, user: req.user.user.id });
  res.json({ msg: 'Item deleted' });
};
