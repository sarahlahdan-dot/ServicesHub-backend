const express = require('express');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.use(verifyToken);

router.post('/', createBooking);

router.get('/mine', getMyBookings);

router.patch('/:id/status', updateBookingStatus);

module.exports = router;
