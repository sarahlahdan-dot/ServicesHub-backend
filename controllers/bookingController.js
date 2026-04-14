const {
  createCustomerBooking,
  listRoleBookings,
  changeBookingStatus,
} = require('../services/bookingService');

const createBooking = async (req, res) => {
  try {
    const booking = await createCustomerBooking({
      serviceId: req.body.serviceId,
      customerId: req.user.id,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await listRoleBookings(req.user);

    return res.json(bookings);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await changeBookingStatus({
      bookingId: req.params.id,
      status: req.body.status,
      currentUser: req.user,
    });

    return res.json(booking);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};