const Booking = require("../models/Booking");
const Service = require("../models/Service");

const createBooking = async (req, res) => {
  try {
    const { serviceId, fromDate, toDate } = req.body;

    if (!serviceId || !fromDate || !toDate) {
      return res
        .status(400)
        .json({ message: "serviceId, fromDate, and toDate are required." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    const booking = await Booking.create({
      serviceId,
      customerId: req.user.id,
      providerId: service.providerId,
      fromDate,
      toDate,
      status: "pending",
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("serviceId")
      .populate("providerId", "name email")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user.id })
      .populate("serviceId")
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["approved", "rejected", "completed"];

    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (String(booking.providerId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Only the provider can update this booking." });
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
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const isParty =
      String(booking.customerId) === String(req.user.id) ||
      String(booking.providerId) === String(req.user.id);

    if (!isParty) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.json(booking.chat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addBookingChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Message content is required." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const isParty =
      String(booking.customerId) === String(req.user.id) ||
      String(booking.providerId) === String(req.user.id);

    if (!isParty) {
      return res.status(403).json({ message: "Access denied." });
    }

    booking.chat.push({
      senderId: req.user.id,
      message: String(message).trim(),
    });

    await booking.save();

    return res.status(201).json(booking.chat[booking.chat.length - 1]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  getBookingChat,
  addBookingChatMessage,
};
