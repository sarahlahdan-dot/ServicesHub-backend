const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const payload = await registerUser(req.body);
    return res.status(201).json(payload);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const payload = await loginUser(req.body);
    return res.json(payload);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};