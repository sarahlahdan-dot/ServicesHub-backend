const express = require('express');
const verifyToken = require('../middleware/verify-token');
const {
  listInbox,
  listUserMessages,
  sendUserMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(verifyToken);

router.get('/inbox', listInbox);
router.get('/user/:userId', listUserMessages);
router.post('/user/:userId', sendUserMessage);

module.exports = router;
