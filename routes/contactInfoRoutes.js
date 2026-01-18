const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getContactInfos,
    createContactInfo,
    updateContactInfo,
    deleteContactInfo
} = require('../controllers/contactInfoController');

// Public routes
router.get('/', languageFilter, getContactInfos);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createContactInfo);
router.put('/', auth, languageFilter, updateContactInfo);
router.delete('/:id', auth, languageFilter, deleteContactInfo);

module.exports = router;
