const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadSingle } = require('../config/upload');
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
router.post('/', auth, uploadSingle, languageFilter, createService);
router.put('/', auth, uploadSingle, languageFilter, updateService);
router.delete('/:id', auth, languageFilter, deleteService);

module.exports = router;
