const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getInventory, addItem, deleteItem } = require('../controllers/inventoryController');

router.get('/', auth, getInventory);
router.post('/', auth, addItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;
