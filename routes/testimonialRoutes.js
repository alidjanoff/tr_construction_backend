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

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createTestimonial);
router.put('/', auth, languageFilter, updateTestimonial);
router.delete('/:id', auth, languageFilter, deleteTestimonial);

module.exports = router;
