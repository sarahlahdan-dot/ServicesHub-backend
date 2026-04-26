const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, and password are required." });
    }

    const existingUser = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      role: role || "customer",
    });

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ token, user: payload });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, user: payload });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
