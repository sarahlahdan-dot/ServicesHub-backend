const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const { getAllServices, getOneService, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', getOneService);
router.post('/', verifyToken, createService);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

module.exports = router;
