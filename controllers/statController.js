const Stat = require('../models/Stat');

// Helper to format stat response
const formatStat = (stat) => ({
    id: stat._id,
    count: Object.fromEntries(stat.count),
    detail: Object.fromEntries(stat.detail)
});

// @desc    Get all stats
// @route   GET /api/v1/stats
exports.getStats = async (req, res) => {
    try {
        const stats = await Stat.find();
        res.json(stats.map(formatStat));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single stat
// @route   GET /api/v1/stats/:id
exports.getStat = async (req, res) => {
    try {
        const stat = await Stat.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        res.json(formatStat(stat));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a stat
// @route   POST /api/v1/stats
exports.createStat = async (req, res) => {
    try {
        const { count, detail } = req.body;

        await Stat.create({
            count: new Map(Object.entries(count)),
            detail: new Map(Object.entries(detail))
        });

        const stats = await Stat.find();
        res.status(201).json(stats.map(formatStat));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a stat
// @route   PUT /api/v1/stats
exports.updateStat = async (req, res) => {
    try {
        const { id, count, detail } = req.body;

        const stat = await Stat.findById(id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }

        stat.count = new Map(Object.entries(count));
        stat.detail = new Map(Object.entries(detail));
        await stat.save();

        const stats = await Stat.find();
        res.json(stats.map(formatStat));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a stat
// @route   DELETE /api/v1/stats/:id
exports.deleteStat = async (req, res) => {
    try {
        const stat = await Stat.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }

        await Stat.findByIdAndDelete(req.params.id);

        const stats = await Stat.find();
        res.json(stats.map(formatStat));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
