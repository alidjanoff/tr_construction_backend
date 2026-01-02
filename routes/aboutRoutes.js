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

// Protected routes
router.post('/', auth, uploadSingle, createAbout);
router.put('/', auth, uploadSingle, updateAbout);

module.exports = router;
