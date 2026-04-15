const express = require('express');
const verifyToken = require('../middleware/verify-token');
const {
  listBookingMessages,
  sendBookingMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(verifyToken);

router.get('/booking/:bookingId', listBookingMessages);
router.post('/booking/:bookingId', sendBookingMessage);

module.exports = router;
