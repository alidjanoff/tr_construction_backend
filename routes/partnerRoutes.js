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

// Protected routes
router.post('/', auth, uploadSingle, createPartner);
router.put('/', auth, uploadSingle, updatePartner);
router.delete('/:id', auth, deletePartner);

module.exports = router;
