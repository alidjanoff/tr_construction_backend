const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getMapUrl,
    updateMapUrl
} = require('../controllers/mapUrlController');

// Public routes
router.get('/', languageFilter, getMapUrl);

// Protected routes
router.put('/', auth, languageFilter, updateMapUrl);

module.exports = router;
