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
router.get('/:id', languageFilter, getService);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createService);
router.put('/', auth, languageFilter, updateService);
router.delete('/:id', auth, languageFilter, deleteService);

module.exports = router;
