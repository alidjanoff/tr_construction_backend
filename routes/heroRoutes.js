const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadMultiple } = require('../config/upload');
const {
    getHero,
    createHero,
    updateHero
} = require('../controllers/heroController');

// Public routes
router.get('/', languageFilter, getHero);

// Protected routes
router.post('/', auth, uploadMultiple, createHero);
router.put('/', auth, uploadMultiple, updateHero);

module.exports = router;
