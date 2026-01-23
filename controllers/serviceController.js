const Service = require('../models/Service');
const { getImageUrl } = require('../config/upload');
const path = require('path');
const fs = require('fs');

// Helper to format service response
const formatService = (service) => ({
    id: service._id,
    title: Object.fromEntries(service.title),
    info: Object.fromEntries(service.info),
    image: service.image ? getImageUrl(service.image) : null
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
        const image = req.file ? req.file.filename : null;

        // Parse JSON strings if they come from FormData
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;

        await Service.create({
            title: new Map(Object.entries(parsedTitle)),
            info: new Map(Object.entries(parsedInfo)),
            image
        });

        const services = await Service.find();
        res.status(201).json(services.map(formatService));
    } catch (error) {
        // Delete uploaded file if error occurs
        if (req.file) {
            const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
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
            // Delete uploaded file if service not found
            if (req.file) {
                const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
            return res.status(404).json({ message: 'Service not found' });
        }

        // Parse JSON strings if they come from FormData
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;

        service.title = new Map(Object.entries(parsedTitle));
        service.info = new Map(Object.entries(parsedInfo));

        if (req.file) {
            // Delete old image if exists
            if (service.image) {
                const oldPath = path.join(__dirname, '../public/uploads', service.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            service.image = req.file.filename;
        }

        await service.save();

        const services = await Service.find();
        res.json(services.map(formatService));
    } catch (error) {
        // Delete uploaded file if error occurs
        if (req.file) {
            const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
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

        // Delete image if exists
        if (service.image) {
            const filePath = path.join(__dirname, '../public/uploads', service.image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Service.findByIdAndDelete(req.params.id);

        const services = await Service.find();
        res.json(services.map(formatService));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
