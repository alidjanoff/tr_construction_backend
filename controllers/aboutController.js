const About = require('../models/About');
const { getImageUrl } = require('../config/upload');

// @desc    Get about section
// @route   GET /api/v1/about
exports.getAbout = async (req, res) => {
    try {
        const about = await About.findOne();
        if (!about) {
            return res.json({
                title: {},
                info: {},
                description: {},
                image: '',
                our_mission: {},
                our_vision: {}
            });
        }
        res.json({
            title: Object.fromEntries(about.title),
            info: Object.fromEntries(about.info),
            description: Object.fromEntries(about.description),
            image: about.image,
            our_mission: Object.fromEntries(about.our_mission),
            our_vision: Object.fromEntries(about.our_vision)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create about section
// @route   POST /api/v1/about
exports.createAbout = async (req, res) => {
    try {
        const { title, info, description, our_mission, our_vision } = req.body;

        const image = req.file ? getImageUrl(req.file.filename) : '';

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;
        const parsedDescription = typeof description === 'string' ? JSON.parse(description) : description;
        const parsedMission = typeof our_mission === 'string' ? JSON.parse(our_mission) : our_mission;
        const parsedVision = typeof our_vision === 'string' ? JSON.parse(our_vision) : our_vision;

        let about = await About.findOne();

        if (about) {
            about.title = new Map(Object.entries(parsedTitle));
            about.info = new Map(Object.entries(parsedInfo));
            about.description = new Map(Object.entries(parsedDescription));
            about.our_mission = new Map(Object.entries(parsedMission));
            about.our_vision = new Map(Object.entries(parsedVision));
            if (image) {
                about.image = image;
            }
            await about.save();
        } else {
            about = await About.create({
                title: new Map(Object.entries(parsedTitle)),
                info: new Map(Object.entries(parsedInfo)),
                description: new Map(Object.entries(parsedDescription)),
                image,
                our_mission: new Map(Object.entries(parsedMission)),
                our_vision: new Map(Object.entries(parsedVision))
            });
        }

        res.status(201).json({
            title: Object.fromEntries(about.title),
            info: Object.fromEntries(about.info),
            description: Object.fromEntries(about.description),
            image: about.image,
            our_mission: Object.fromEntries(about.our_mission),
            our_vision: Object.fromEntries(about.our_vision)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update about section
// @route   PUT /api/v1/about
exports.updateAbout = async (req, res) => {
    try {
        const { title, info, description, our_mission, our_vision } = req.body;

        const image = req.file ? getImageUrl(req.file.filename) : null;

        // Parse fields if they are strings
        const parsedTitle = typeof title === 'string' ? JSON.parse(title) : title;
        const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;
        const parsedDescription = typeof description === 'string' ? JSON.parse(description) : description;
        const parsedMission = typeof our_mission === 'string' ? JSON.parse(our_mission) : our_mission;
        const parsedVision = typeof our_vision === 'string' ? JSON.parse(our_vision) : our_vision;

        let about = await About.findOne();

        if (!about) {
            return res.status(404).json({ message: 'About not found' });
        }

        about.title = new Map(Object.entries(parsedTitle));
        about.info = new Map(Object.entries(parsedInfo));
        about.description = new Map(Object.entries(parsedDescription));
        about.our_mission = new Map(Object.entries(parsedMission));
        about.our_vision = new Map(Object.entries(parsedVision));
        if (image) {
            about.image = image;
        }
        await about.save();

        res.json({
            title: Object.fromEntries(about.title),
            info: Object.fromEntries(about.info),
            description: Object.fromEntries(about.description),
            image: about.image,
            our_mission: Object.fromEntries(about.our_mission),
            our_vision: Object.fromEntries(about.our_vision)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
