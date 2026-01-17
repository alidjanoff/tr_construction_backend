const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const { uploadSingle } = require('../config/upload');
const {
    getHero,
    createHero,
    updateHero,
    deleteHero
} = require('../controllers/heroController');

// Public routes
router.get('/', languageFilter, getHero);

// Protected routes
router.post('/', auth, uploadSingle, createHero);
router.put('/:id', auth, uploadSingle, updateHero);
router.delete('/:id', auth, deleteHero);

module.exports = router;
