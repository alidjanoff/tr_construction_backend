const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Public routes
router.get('/', languageFilter, getServices);
router.get('/:id', auth, getService);

// Protected routes
router.post('/', auth, createService);
router.put('/', auth, updateService);
router.delete('/:id', auth, deleteService);

module.exports = router;
