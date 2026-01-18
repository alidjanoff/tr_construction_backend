const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
} = require('../controllers/applicationController');

// Public route (contact form submission)
router.post('/', languageFilter, createApplication);

// Protected routes (languageFilter to show response in language context)
router.get('/', auth, languageFilter, getApplications);
router.put('/', auth, languageFilter, updateApplication);
router.delete('/:id', auth, languageFilter, deleteApplication);

module.exports = router;
