const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
} = require('../controllers/languageController');

// Public routes
router.get('/', languageFilter, getLanguages);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createLanguage);
router.put('/', auth, languageFilter, updateLanguage);
router.delete('/:id', auth, languageFilter, deleteLanguage);

module.exports = router;
