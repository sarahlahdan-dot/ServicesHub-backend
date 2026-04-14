const express = require('express');
const verifyToken = require('../middleware/verify-token');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingChat,
  addBookingChatMessage,
} = require('./bookingController');

const router = express.Router();

router.use(verifyToken);

router.post('/', createBooking);
router.get('/mine', getMyBookings);
router.patch('/:id/status', updateBookingStatus);
router.get('/:id/chat', getBookingChat);
router.post('/:id/chat', addBookingChatMessage);

module.exports = router;
