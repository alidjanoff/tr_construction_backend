const Service = require('../models/Service');

// Helper to format service response
const formatService = (service) => ({
    id: service._id,
    title: Object.fromEntries(service.title),
    info: Object.fromEntries(service.info)
});

// @desc    Get all services
// @route   GET /api/v1/services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services.map(formatService));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(formatService(service));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a service
// @route   POST /api/v1/services
exports.createService = async (req, res) => {
    try {
        const { title, info } = req.body;

        await Service.create({
            title: new Map(Object.entries(title)),
            info: new Map(Object.entries(info))
        });

        const services = await Service.find();
        res.status(201).json(services.map(formatService));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a service
// @route   PUT /api/v1/services
exports.updateService = async (req, res) => {
    try {
        const { id, title, info } = req.body;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        service.title = new Map(Object.entries(title));
        service.info = new Map(Object.entries(info));
        await service.save();

        const services = await Service.find();
        res.json(services.map(formatService));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a service
// @route   DELETE /api/v1/services/:id
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await Service.findByIdAndDelete(req.params.id);

        const services = await Service.find();
        res.json(services.map(formatService));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
