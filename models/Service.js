const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true, min: 0 },
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
