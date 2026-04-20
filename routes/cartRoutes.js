const express = require('express');
const {
  getCart,
  addCartItem,
  removeCartItem,
  checkoutCart,
} = require('../controllers/cartController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('customer'));

router.get('/', getCart);

router.post('/items', addCartItem);

router.delete('/items/:serviceId', removeCartItem);

router.post('/checkout', checkoutCart);

module.exports = router;
