const Workflow = require('../models/Workflow');

// Helper to format workflow response
const formatWorkflow = (workflow) => ({
    id: workflow._id,
    title: Object.fromEntries(workflow.title),
    details: Object.fromEntries(workflow.details)
});

// @desc    Get all workflows
// @route   GET /api/v1/workflow
exports.getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find();
        res.json(workflows.map(formatWorkflow));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a workflow
// @route   POST /api/v1/workflow
exports.createWorkflow = async (req, res) => {
    try {
        const { title, details } = req.body;

        await Workflow.create({
            title: new Map(Object.entries(title)),
            details: new Map(Object.entries(details))
        });

        const workflows = await Workflow.find();
        res.status(201).json(workflows.map(formatWorkflow));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a workflow
// @route   PUT /api/v1/workflow
exports.updateWorkflow = async (req, res) => {
    try {
        const { id, title, details } = req.body;

        const workflow = await Workflow.findById(id);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        workflow.title = new Map(Object.entries(title));
        workflow.details = new Map(Object.entries(details));
        await workflow.save();

        const workflows = await Workflow.find();
        res.json(workflows.map(formatWorkflow));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a workflow
// @route   DELETE /api/v1/workflow/:id
exports.deleteWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        await Workflow.findByIdAndDelete(req.params.id);

        const workflows = await Workflow.find();
        res.json(workflows.map(formatWorkflow));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
