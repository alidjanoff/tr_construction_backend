const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    getMapUrl,
    updateMapUrl
} = require('../controllers/mapUrlController');

// Public routes
router.get('/', getMapUrl);

// Protected routes
router.put('/', auth, updateMapUrl);

module.exports = router;
