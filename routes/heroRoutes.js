const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadMultiple } = require('../config/upload');
const {
    getHero,
    createHero,
    updateHero,
    deleteHero
} = require('../controllers/heroController');

// Public routes
router.get('/', languageFilter, getHero);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, uploadMultiple, languageFilter, createHero);
router.put('/:id', auth, uploadMultiple, languageFilter, updateHero);
router.delete('/:id', auth, deleteHero);

module.exports = router;
