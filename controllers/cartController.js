const Cart = require('../models/Cart');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id }).populate('items.serviceId');
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { serviceId, fromDate, toDate } = req.body;

    if (!serviceId || !fromDate || !toDate) {
      return res.status(400).json({ message: 'serviceId, fromDate, and toDate are required.' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    let cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ customerId: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex((item) => String(item.serviceId) === String(serviceId));
    const itemPayload = {
      serviceId,
      providerId: service.providerId,
      fromDate,
      toDate,
    };

    if (existingIndex >= 0) {
      cart.items[existingIndex] = itemPayload;
    } else {
      cart.items.push(itemPayload);
    }

    await cart.save();
    const populated = await Cart.findOne({ customerId: req.user.id }).populate('items.serviceId');

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const beforeCount = cart.items.length;
    cart.items = cart.items.filter((item) => String(item.serviceId) !== String(req.params.serviceId));

    if (beforeCount === cart.items.length) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    await cart.save();

    return res.json({ message: 'Item removed from cart' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const bookingPayload = cart.items.map((item) => ({
      serviceId: item.serviceId,
      customerId: req.user.id,
      providerId: item.providerId,
      fromDate: item.fromDate,
      toDate: item.toDate,
      status: 'pending',
    }));

    const bookings = await Booking.insertMany(bookingPayload);
    cart.items = [];
    await cart.save();

    return res.status(201).json({ message: 'Checkout successful', bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addCartItem,
  removeCartItem,
  checkoutCart,
};