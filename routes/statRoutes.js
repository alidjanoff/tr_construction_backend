const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getStats,
    getStat,
    createStat,
    updateStat,
    deleteStat
} = require('../controllers/statController');

// Public routes
router.get('/', languageFilter, getStats);
router.get('/:id', languageFilter, getStat);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createStat);
router.put('/', auth, languageFilter, updateStat);
router.delete('/:id', auth, languageFilter, deleteStat);

module.exports = router;
