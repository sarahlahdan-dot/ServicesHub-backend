const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const { createReview, getReviewsByService } = require('../controllers/reviewController');

router.post('/:bookingId', verifyToken, createReview);
router.get('/service/:serviceId', getReviewsByService);

module.exports = router;
