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

// Protected routes
router.post('/', auth, createContactInfo);
router.put('/', auth, updateContactInfo);
router.delete('/:id', auth, deleteContactInfo);

module.exports = router;
