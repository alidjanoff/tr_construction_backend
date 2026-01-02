const Partner = require('../models/Partner');
const { getImageUrl } = require('../config/upload');

// Helper to format partner response
const formatPartner = (partner) => ({
    id: partner._id,
    title: Object.fromEntries(partner.title),
    image: partner.image
});

// @desc    Get all partners
// @route   GET /api/v1/partners
exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.json(partners.map(formatPartner));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a partner
// @route   POST /api/v1/partners
exports.createPartner = async (req, res) => {
    try {
        const { title } = req.body;
        const image = req.file ? getImageUrl(req.file.filename) : '';

        // Parse title if it's a string
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;

        await Partner.create({
            title: new Map(Object.entries(parsedTitle)),
            image
        });

        const partners = await Partner.find();
        res.status(201).json(partners.map(formatPartner));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a partner
// @route   PUT /api/v1/partners
exports.updatePartner = async (req, res) => {
    try {
        const { id, title } = req.body;
        const image = req.file ? getImageUrl(req.file.filename) : null;

        // Parse title if it's a string
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;

        const partner = await Partner.findById(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        partner.title = new Map(Object.entries(parsedTitle));
        if (image) partner.image = image;
        await partner.save();

        const partners = await Partner.find();
        res.json(partners.map(formatPartner));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a partner
// @route   DELETE /api/v1/partners/:id
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        await Partner.findByIdAndDelete(req.params.id);

        const partners = await Partner.find();
        res.json(partners.map(formatPartner));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
