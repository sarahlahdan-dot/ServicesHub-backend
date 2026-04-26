const Review = require("../models/Review");
const Booking = require("../models/Booking");

const createReview = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Cannot review — booking must be completed first." });
    }

    // Only the customer can review
    if (String(booking.customerId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Only the customer can review this booking." });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this booking." });
    }

    const review = await Review.create({
      bookingId,
      userId: req.user.id, // fix: was req.user._id
      providerId: booking.providerId,
      serviceType: booking.serviceId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceType: req.params.serviceId })
      .populate("userId", "name") // fix: was 'username'
      .populate("providerId", "name"); // fix: was 'username'
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getReviewsByService };
