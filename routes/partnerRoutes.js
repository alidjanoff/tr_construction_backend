const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadSingle } = require('../config/upload');
const {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner
} = require('../controllers/partnerController');

// Public routes
router.get('/', languageFilter, getPartners);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, uploadSingle, languageFilter, createPartner);
router.put('/', auth, uploadSingle, languageFilter, updatePartner);
router.delete('/:id', auth, languageFilter, deletePartner);

module.exports = router;
