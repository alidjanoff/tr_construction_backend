const MapUrl = require('../models/MapUrl');

// @desc    Get map coordinates
// @route   GET /api/v1/map_url
exports.getMapUrl = async (req, res) => {
    try {
        const mapUrl = await MapUrl.findOne();
        if (!mapUrl) {
            return res.json({ long: '', lat: '' });
        }
        res.json({
            long: mapUrl.long,
            lat: mapUrl.lat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update map coordinates
// @route   PUT /api/v1/map_url
exports.updateMapUrl = async (req, res) => {
    try {
        const { long, lat } = req.body;

        let mapUrl = await MapUrl.findOne();

        if (mapUrl) {
            mapUrl.long = long;
            mapUrl.lat = lat;
            await mapUrl.save();
        } else {
            mapUrl = await MapUrl.create({ long, lat });
        }

        res.json({
            long: mapUrl.long,
            lat: mapUrl.lat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
