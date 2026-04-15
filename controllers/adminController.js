const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [users, providers, customers, services, bookings, reviews] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'provider' }),
      User.countDocuments({ role: 'customer' }),
      Service.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    const stats = {
      users,
      providers,
      customers,
      services,
      bookings,
      reviews,
    };
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getStats,
};