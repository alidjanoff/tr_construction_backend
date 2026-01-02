const Social = require('../models/Social');

// Helper to format social response
const formatSocial = (social) => ({
    id: social._id,
    url: social.url,
    type: social.type
});

// @desc    Get all socials
// @route   GET /api/v1/socials
exports.getSocials = async (req, res) => {
    try {
        const socials = await Social.find();
        res.json(socials.map(formatSocial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a social
// @route   POST /api/v1/socials
exports.createSocial = async (req, res) => {
    try {
        const { url, type } = req.body;

        await Social.create({ url, type });

        const socials = await Social.find();
        res.status(201).json(socials.map(formatSocial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a social
// @route   PUT /api/v1/socials
exports.updateSocial = async (req, res) => {
    try {
        const { id, url, type } = req.body;

        const social = await Social.findById(id);
        if (!social) {
            return res.status(404).json({ message: 'Social not found' });
        }

        social.url = url;
        social.type = type;
        await social.save();

        const socials = await Social.find();
        res.json(socials.map(formatSocial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a social
// @route   DELETE /api/v1/socials/:id
exports.deleteSocial = async (req, res) => {
    try {
        const social = await Social.findById(req.params.id);
        if (!social) {
            return res.status(404).json({ message: 'Social not found' });
        }

        await Social.findByIdAndDelete(req.params.id);

        const socials = await Social.find();
        res.json(socials.map(formatSocial));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
