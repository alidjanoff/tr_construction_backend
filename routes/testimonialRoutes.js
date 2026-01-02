const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', languageFilter, getTestimonials);

// Protected routes
router.post('/', auth, createTestimonial);
router.put('/', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
