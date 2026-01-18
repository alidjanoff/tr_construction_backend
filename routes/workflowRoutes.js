const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const languageFilter = require('../middlewares/languageFilter');
const {
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
} = require('../controllers/workflowController');

// Public routes
router.get('/', languageFilter, getWorkflows);

// Protected routes (languageFilter to show response in language context)
router.post('/', auth, languageFilter, createWorkflow);
router.put('/', auth, languageFilter, updateWorkflow);
router.delete('/:id', auth, languageFilter, deleteWorkflow);

module.exports = router;
