const mongoose = require('mongoose');

const mapUrlSchema = new mongoose.Schema({
    long: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MapUrl', mapUrlSchema);
