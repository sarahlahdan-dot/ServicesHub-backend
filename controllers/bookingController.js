const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const BOOKING_STATUS = ['pending', 'approved', 'rejected', 'completed'];

const createBooking = async (req, res) => {
  try {
    const { serviceId, fromDate, toDate } = req.body;

    if (!serviceId || !fromDate || !toDate) {
      return res.status(400).json({ message: 'serviceId, fromDate, and toDate are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid serviceId.' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const booking = await Booking.create({
      serviceId,
      customerId: req.user.id,
      providerId: service.provider,
      fromDate,
      toDate,
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    let filter;
    if (req.user.role === 'provider') {
      filter = { providerId: req.user.id };
    } else if (req.user.role === 'customer') {
      filter = { customerId: req.user.id };
    } else {
      filter = {};
    }

    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('customerId', 'name email role')
      .populate('providerId', 'name email role')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!BOOKING_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status.' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (req.user.role !== 'admin' && String(booking.providerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only provider can update booking status.' });
    }

    booking.status = status;
    await booking.save();

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};