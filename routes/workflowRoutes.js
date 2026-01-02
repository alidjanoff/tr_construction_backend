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

// Protected routes
router.post('/', auth, createWorkflow);
router.put('/', auth, updateWorkflow);
router.delete('/:id', auth, deleteWorkflow);

module.exports = router;
