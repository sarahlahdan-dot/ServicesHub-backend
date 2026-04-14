const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const BOOKING_STATUS = ['pending', 'approved', 'rejected', 'completed'];

const isBookingParticipant = (booking, userId) => {
  const id = String(userId);
  return String(booking.customerId) === id || String(booking.providerId) === id;
};

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

const getBookingChat = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('chat.senderId', 'name email role')
      .select('customerId providerId chat status');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (req.user.role !== 'admin' && !isBookingParticipant(booking, req.user.id)) {
      return res.status(403).json({ message: 'You are not allowed to view this chat.' });
    }

    return res.json({
      bookingId: booking._id,
      status: booking.status,
      chat: booking.chat,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addBookingChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (req.user.role !== 'admin' && !isBookingParticipant(booking, req.user.id)) {
      return res.status(403).json({ message: 'You are not allowed to send messages in this chat.' });
    }

    booking.chat.push({
      senderId: req.user.id,
      message: String(message).trim(),
    });

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('chat.senderId', 'name email role')
      .select('chat');

    return res.status(201).json({ chat: populated.chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingChat,
  addBookingChatMessage,
};