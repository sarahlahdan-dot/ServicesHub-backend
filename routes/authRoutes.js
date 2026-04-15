const express = require('express');
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/verify', verifyToken, (req, res) => {
	return res.json({ valid: true, user: req.user });
});

module.exports = router;
