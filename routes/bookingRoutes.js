const express = require('express');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingChat,
  addBookingChatMessage,
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.use(verifyToken);

router.post('/', createBooking);

router.get('/mine', getMyBookings);

router.patch('/:id/status', updateBookingStatus);

router.get('/:id/chat', getBookingChat);

router.post('/:id/chat', addBookingChatMessage);

module.exports = router;
