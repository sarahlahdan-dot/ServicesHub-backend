const mongoose = require('mongoose');
   

    const reviewSchema = new mongoose.Schema({
        bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking' },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        providerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        serviceType: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    });

    const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;