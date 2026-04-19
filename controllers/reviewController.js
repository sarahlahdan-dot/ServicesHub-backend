const Review = require('../models/Review');
const Booking = require('../models/Booking');

const createReview = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'Cannot make a review, booking status must be completed!' });
        }

        req.body.bookingId = bookingId;
        req.body.userId = req.user._id;
        req.body.providerId = booking.providerId;
        req.body.serviceType = booking.serviceId;

        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
};

const getReviewsByService = async (req, res) => {
    try {
        const reviews = await Review.find({ serviceType: req.params.serviceId })
            .populate('userId', 'username')
            .populate('providerId', 'username');
        res.json(reviews);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
};

module.exports = { createReview, getReviewsByService };
