const express = require('express');
const verifyToken = require('../middleware/verify-token');
const {
  createProviderReview,
  getProviderReviews,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/providers/:providerId', getProviderReviews);
router.post('/providers/:providerId', verifyToken, createProviderReview);

module.exports = router;
