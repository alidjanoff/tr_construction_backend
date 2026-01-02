const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getSocials,
    createSocial,
    updateSocial,
    deleteSocial
} = require('../controllers/socialController');

// Public routes
router.get('/', languageFilter, getSocials);

// Protected routes
router.post('/', auth, createSocial);
router.put('/', auth, updateSocial);
router.delete('/:id', auth, deleteSocial);

module.exports = router;
