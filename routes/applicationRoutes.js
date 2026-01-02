const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
} = require('../controllers/applicationController');

// Public route (contact form submission)
router.post('/', createApplication);

// Protected routes
router.get('/', auth, getApplications);
router.put('/', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
