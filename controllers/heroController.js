const Hero = require('../models/Hero');
const { getImageUrl } = require('../config/upload');

// @desc    Get hero section
// @route   GET /api/v1/hero
exports.getHero = async (req, res) => {
    try {
        const hero = await Hero.findOne();
        if (!hero) {
            return res.json({
                title: {},
                info: {},
                images: []
            });
        }
        res.json({
            title: Object.fromEntries(hero.title),
            info: Object.fromEntries(hero.info),
            images: hero.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create hero section
// @route   POST /api/v1/hero
exports.createHero = async (req, res) => {
    try {
        const { title, info } = req.body;

        // Get image URLs from uploaded files
        const images = req.files ? req.files.map(file => getImageUrl(file.filename)) : [];

        // Parse title and info if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;

        // Check if hero already exists
        let hero = await Hero.findOne();

        if (hero) {
            // Update existing hero
            hero.title = new Map(Object.entries(parsedTitle));
            hero.info = new Map(Object.entries(parsedInfo));
            if (images.length > 0) {
                hero.images = images;
            }
            await hero.save();
        } else {
            // Create new hero
            hero = await Hero.create({
                title: new Map(Object.entries(parsedTitle)),
                info: new Map(Object.entries(parsedInfo)),
                images
            });
        }

        res.status(201).json({
            title: Object.fromEntries(hero.title),
            info: Object.fromEntries(hero.info),
            images: hero.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update hero section
// @route   PUT /api/v1/hero
exports.updateHero = async (req, res) => {
    try {
        const { title, info } = req.body;

        // Get image URLs from uploaded files
        const images = req.files ? req.files.map(file => getImageUrl(file.filename)) : [];

        // Parse title and info if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;

        let hero = await Hero.findOne();

        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        hero.title = new Map(Object.entries(parsedTitle));
        hero.info = new Map(Object.entries(parsedInfo));
        if (images.length > 0) {
            hero.images = images;
        }
        await hero.save();

        res.json({
            title: Object.fromEntries(hero.title),
            info: Object.fromEntries(hero.info),
            images: hero.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
