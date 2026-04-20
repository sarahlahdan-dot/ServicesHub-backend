const User = require('../models/User');
const Message = require('../models/Message');

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
    const [users, providers, customers, admins, messages] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'provider' }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'admin' }),
      Message.countDocuments(),
    ]);

    const stats = {
      users,
      providers,
      customers,
      admins,
      messages,
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