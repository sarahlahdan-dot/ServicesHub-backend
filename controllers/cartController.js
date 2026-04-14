const {
  getCustomerCart,
  upsertCartItem,
  deleteCartItem,
  checkoutCustomerCart,
} = require('../services/cartService');

const getCart = async (req, res) => {
  try {
    const cart = await getCustomerCart(req.user.id);
    return res.json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const populated = await upsertCartItem({
      customerId: req.user.id,
      serviceId: req.body.serviceId,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
    });

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    await deleteCartItem({ customerId: req.user.id, serviceId: req.params.serviceId });

    return res.json({ message: 'Item removed from cart' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const bookings = await checkoutCustomerCart(req.user.id);

    return res.status(201).json({ message: 'Checkout successful', bookings });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addCartItem,
  removeCartItem,
  checkoutCart,
};