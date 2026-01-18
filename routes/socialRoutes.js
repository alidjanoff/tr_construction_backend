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

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createSocial);
router.put('/', auth, languageFilter, updateSocial);
router.delete('/:id', auth, languageFilter, deleteSocial);

module.exports = router;
