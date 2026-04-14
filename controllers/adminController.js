const { listUsers, getPlatformStats } = require('../services/adminService');

const getUsers = async (req, res) => {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await getPlatformStats();
    return res.json(stats);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getStats,
};