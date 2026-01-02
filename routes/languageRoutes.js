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

// Protected routes
router.post('/', auth, createLanguage);
router.put('/', auth, updateLanguage);
router.delete('/:id', auth, deleteLanguage);

module.exports = router;
