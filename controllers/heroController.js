const Hero = require('../models/Hero');
const { getImageUrl } = require('../config/upload');

// Helper to format hero for response
const formatHero = (hero) => ({
    id: hero._id,
    title: hero.title ? Object.fromEntries(hero.title) : {},
    info: hero.info ? Object.fromEntries(hero.info) : {},
    image_url: hero.image_url || '',
    button_text: hero.button_text ? Object.fromEntries(hero.button_text) : {},
    button_url: hero.button_url || ''
});

// @desc    Get all hero slides
// @route   GET /api/v1/hero
exports.getHero = async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes.map(formatHero));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create hero slide
// @route   POST /api/v1/hero
exports.createHero = async (req, res) => {
    try {
        const { title, info, button_text, button_url } = req.body;

        // Get image URL from uploaded file
        const image_url = req.file ? getImageUrl(req.file.filename) : '';

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : (title || {});
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : (info || {});
        const parsedButtonText = typeof button_text === 'string' ? JSON.parse(button_text) : (button_text || {});

        await Hero.create({
            title: new Map(Object.entries(parsedTitle)),
            info: new Map(Object.entries(parsedInfo)),
            image_url,
            button_text: new Map(Object.entries(parsedButtonText)),
            button_url: button_url || ''
        });

        // Return all hero slides
        const heroes = await Hero.find();
        res.status(201).json(heroes.map(formatHero));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update hero slide by ID
// @route   PUT /api/v1/hero/:id
exports.updateHero = async (req, res) => {
    try {
        const { title, info, button_text, button_url } = req.body;

        // Get image URL from uploaded file
        const image_url = req.file ? getImageUrl(req.file.filename) : null;

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;
        const parsedButtonText = typeof button_text === 'string' ? JSON.parse(button_text) : button_text;

        const hero = await Hero.findById(req.params.id);

        if (!hero) {
            return res.status(404).json({ message: 'Hero slide not found' });
        }

        // Update fields if provided
        if (parsedTitle) hero.title = new Map(Object.entries(parsedTitle));
        if (parsedInfo) hero.info = new Map(Object.entries(parsedInfo));
        if (image_url) hero.image_url = image_url;
        if (parsedButtonText) hero.button_text = new Map(Object.entries(parsedButtonText));
        if (button_url !== undefined) hero.button_url = button_url;

        await hero.save();

        // Return all hero slides
        const heroes = await Hero.find();
        res.json(heroes.map(formatHero));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete hero slide by ID
// @route   DELETE /api/v1/hero/:id
exports.deleteHero = async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);

        if (!hero) {
            return res.status(404).json({ message: 'Hero slide not found' });
        }

        await Hero.findByIdAndDelete(req.params.id);

        // Return remaining hero slides
        const heroes = await Hero.find();
        res.json(heroes.map(formatHero));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
