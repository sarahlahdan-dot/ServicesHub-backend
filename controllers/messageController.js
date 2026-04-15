const Booking = require('../models/Booking');
const Message = require('../models/Message');

const resolveBookingAndValidateParticipant = async (bookingId, currentUser) => {
  const booking = await Booking.findById(bookingId).select('customerId providerId status');

  if (!booking) {
    return { error: { status: 404, message: 'Booking not found.' } };
  }

  const userId = String(currentUser.id);
  const customerId = String(booking.customerId);
  const providerId = String(booking.providerId);
  const isParticipant = userId === customerId || userId === providerId;

  if (currentUser.role !== 'admin' && !isParticipant) {
    return { error: { status: 403, message: 'You are not allowed to access these messages.' } };
  }

  return { booking, customerId, providerId };
};

const listBookingMessages = async (req, res) => {
  try {
    const result = await resolveBookingAndValidateParticipant(req.params.bookingId, req.user);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const messages = await Message.find({ bookingId: req.params.bookingId })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: 1 });

    return res.json({ bookingId: req.params.bookingId, messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendBookingMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const result = await resolveBookingAndValidateParticipant(req.params.bookingId, req.user);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const senderId = String(req.user.id);
    let receiverId;

    if (senderId === result.customerId) {
      receiverId = result.providerId;
    } else if (senderId === result.providerId) {
      receiverId = result.customerId;
    } else {
      return res.status(400).json({ message: 'Admin must explicitly provide receiverId.' });
    }

    const message = await Message.create({
      bookingId: req.params.bookingId,
      senderId,
      receiverId,
      content: String(content).trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listBookingMessages,
  sendBookingMessage,
};
