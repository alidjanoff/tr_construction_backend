const Application = require('../models/Application');

// Helper to format application response
const formatApplication = (application) => ({
    id: application._id,
    full_name: application.full_name,
    email: application.email,
    phone: application.phone,
    message: application.message,
    is_viewed: application.is_viewed
});

// @desc    Get all applications (protected)
// @route   GET /api/v1/applications
exports.getApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.json(applications.map(formatApplication));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create application (public - contact form submission)
// @route   POST /api/v1/applications
exports.createApplication = async (req, res) => {
    try {
        const { full_name, email, phone, message } = req.body;

        await Application.create({
            full_name,
            email,
            phone,
            message,
            is_viewed: false
        });

        res.status(201).json('Müraciətiniz qəbul olundu');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application (mark as viewed)
// @route   PUT /api/v1/applications
exports.updateApplication = async (req, res) => {
    try {
        const { id, is_viewed } = req.body;

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.is_viewed = is_viewed;
        await application.save();

        const applications = await Application.find().sort({ createdAt: -1 });
        res.json(applications.map(formatApplication));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await Application.findByIdAndDelete(req.params.id);

        const applications = await Application.find().sort({ createdAt: -1 });
        res.json(applications.map(formatApplication));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
