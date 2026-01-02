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
router.get('/:id', auth, getStat);

// Protected routes
router.post('/', auth, createStat);
router.put('/', auth, updateStat);
router.delete('/:id', auth, deleteStat);

module.exports = router;
