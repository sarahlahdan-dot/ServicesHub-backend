const express = require('express');
const verifyToken = require('../middleware/verify-token');
const {
  listUserMessages,
  sendUserMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(verifyToken);

router.get('/user/:userId', listUserMessages);
router.post('/user/:userId', sendUserMessage);

module.exports = router;
