const express = require('express');
const {
  getServices,
  getProviders,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getServices);

router.get('/providers', getProviders);

router.post('/', protect, authorizeRoles('admin', 'provider'), createService);

router.put('/:id', protect, authorizeRoles('admin', 'provider'), updateService);

router.delete('/:id', protect, authorizeRoles('admin', 'provider'), deleteService);

module.exports = router;
