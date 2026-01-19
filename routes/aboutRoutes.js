const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadSingle } = require('../config/upload');
const {
    getAbout,
    createAbout,
    updateAbout
} = require('../controllers/aboutController');

// Public routes
router.get('/', languageFilter, getAbout);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, uploadSingle, languageFilter, createAbout);
router.put('/', auth, uploadSingle, languageFilter, updateAbout);

module.exports = router;
