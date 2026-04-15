const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const User = require('../models/User');

const getProviderRatingSummary = async (providerId) => {
  const [summary] = await Review.aggregate([
    { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
    {
      $group: {
        _id: '$providerId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  return {
    averageRating: summary ? Number(summary.averageRating.toFixed(2)) : 0,
    reviewCount: summary ? summary.reviewCount : 0,
  };
};

const createProviderReview = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: 'Invalid providerId.' });
    }

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can submit reviews.' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer from 1 to 5.' });
    }

    const provider = await User.findById(providerId).select('role name');
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ message: 'Service provider not found.' });
    }

    const hasCompletedBooking = await Booking.exists({
      customerId: req.user.id,
      providerId,
      status: 'completed',
    });

    if (!hasCompletedBooking) {
      return res.status(403).json({
        message: 'You can only review providers for services you completed.',
      });
    }

    const existingReview = await Review.findOne({
      customerId: req.user.id,
      providerId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: 'You already reviewed this provider. Only one review is allowed.',
      });
    }

    const review = await Review.create({
      providerId,
      customerId: req.user.id,
      rating: numericRating,
      comment: comment ? String(comment).trim() : '',
    });

    const ratingSummary = await getProviderRatingSummary(providerId);

    return res.status(201).json({ review, ratingSummary });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: 'Invalid providerId.' });
    }

    const provider = await User.findById(providerId).select('role name email');
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ message: 'Service provider not found.' });
    }

    const reviews = await Review.find({ providerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    const ratingSummary = await getProviderRatingSummary(providerId);

    return res.json({
      provider,
      ratingSummary,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProviderReview,
  getProviderReviews,
};
